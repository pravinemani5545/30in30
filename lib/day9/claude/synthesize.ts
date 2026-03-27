import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { SearchResult, ClaudeBriefingOutput, ConfidenceLevel, DataQuality } from "@/types/day9";
import { SYSTEM_PROMPT, buildSynthesisPrompt } from "./prompts";

const geminiSchema: import("@google/generative-ai").ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    background: {
      type: SchemaType.OBJECT,
      properties: {
        text: { type: SchemaType.STRING, description: "3-4 sentences about who this person is" },
        confidence: { type: SchemaType.STRING, format: "enum", enum: ["verified", "likely", "uncertain"] },
        notes: { type: SchemaType.STRING, description: "Additional notes if data is limited, or empty string", nullable: true },
      },
      required: ["text", "confidence"],
    },
    companyContext: {
      type: SchemaType.OBJECT,
      properties: {
        text: { type: SchemaType.STRING, description: "3-4 sentences about the company" },
        confidence: { type: SchemaType.STRING, format: "enum", enum: ["verified", "likely", "uncertain"] },
        notes: { type: SchemaType.STRING, description: "Additional notes if data is limited, or empty string", nullable: true },
      },
      required: ["text", "confidence"],
    },
    talkingPoints: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          point: { type: SchemaType.STRING, description: "Bold opener for the talking point" },
          explanation: { type: SchemaType.STRING, description: "2-sentence explanation" },
          source: { type: SchemaType.STRING, description: "Source citation or empty string", nullable: true },
        },
        required: ["point", "explanation"],
      },
      description: "Exactly 3 talking points tailored to the meeting context",
    },
    objections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          objection: { type: SchemaType.STRING, description: "How they might phrase the objection" },
          response: { type: SchemaType.STRING, description: "Suggested response" },
        },
        required: ["objection", "response"],
      },
      description: "Exactly 3 likely objections with responses",
    },
    conversationStarters: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          starter: { type: SchemaType.STRING, description: "A specific conversation opener referencing research facts" },
          seededBy: { type: SchemaType.STRING, description: "Which research fact seeded this starter" },
        },
        required: ["starter", "seededBy"],
      },
      description: "Exactly 2 non-generic conversation starters seeded by specific facts",
    },
    sources: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          url: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          queryType: { type: SchemaType.STRING },
          date: { type: SchemaType.STRING, nullable: true },
        },
        required: ["url", "title", "queryType"],
      },
    },
    dataQuality: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["rich", "adequate", "limited"],
      description: "Overall quality of research data available",
    },
    dataQualityNote: {
      type: SchemaType.STRING,
      description: "Explanation if quality is limited, or empty string",
      nullable: true,
    },
  },
  required: [
    "background", "companyContext", "talkingPoints", "objections",
    "conversationStarters", "sources", "dataQuality", "dataQualityNote",
  ],
};

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return client;
}

export async function synthesizeBriefing(
  person: string,
  company: string,
  meetingContext: string,
  results: SearchResult[],
  isCached: boolean
): Promise<ClaudeBriefingOutput> {
  const userPrompt = buildSynthesisPrompt(person, company, meetingContext, results, isCached);
  const startMs = Date.now();

  const model = getClient().getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: geminiSchema,
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent(userPrompt);
  const elapsedMs = Date.now() - startMs;
  const raw = JSON.parse(result.response.text()) as Record<string, unknown>;

  // Map raw response to typed output
  const bg = raw.background as Record<string, unknown>;
  const cc = raw.companyContext as Record<string, unknown>;

  const output: ClaudeBriefingOutput = {
    background: {
      text: (bg.text as string) ?? "",
      confidence: (bg.confidence as ConfidenceLevel) ?? "uncertain",
      notes: (bg.notes as string) || null,
    },
    companyContext: {
      text: (cc.text as string) ?? "",
      confidence: (cc.confidence as ConfidenceLevel) ?? "uncertain",
      notes: (cc.notes as string) || null,
    },
    talkingPoints: (raw.talkingPoints as Array<Record<string, unknown>>).map((tp) => ({
      point: (tp.point as string) ?? "",
      explanation: (tp.explanation as string) ?? "",
      source: (tp.source as string) || null,
    })),
    objections: (raw.objections as Array<Record<string, unknown>>).map((obj) => ({
      objection: (obj.objection as string) ?? "",
      response: (obj.response as string) ?? "",
    })),
    conversationStarters: (raw.conversationStarters as Array<Record<string, unknown>>).map((cs) => ({
      starter: (cs.starter as string) ?? "",
      seededBy: (cs.seededBy as string) ?? "",
    })),
    sources: (raw.sources as Array<Record<string, unknown>>).map((s) => ({
      url: (s.url as string) ?? "",
      title: (s.title as string) ?? "",
      queryType: (s.queryType as string) ?? "",
      date: (s.date as string) || null,
    })),
    dataQuality: (raw.dataQuality as DataQuality) ?? "limited",
    dataQualityNote: (raw.dataQualityNote as string) || null,
  };

  // Post-validation: check for insufficient data markers
  const hasInsufficientStarters = output.conversationStarters.some((s) =>
    s.starter.includes("[INSUFFICIENT_DATA")
  );
  if (hasInsufficientStarters) {
    console.warn("[synthesize] Conversation starters contain INSUFFICIENT_DATA markers");
  }

  // Log: initials only, never full names
  const initials = person.split(" ").map((n) => n[0]).join("").toUpperCase();
  console.log(`[synthesize] ${initials}@${company} quality=${output.dataQuality} ms=${elapsedMs}`);

  return output;
}
