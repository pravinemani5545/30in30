import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai'
import { z } from 'zod'
import { SYSTEM_PROMPT, buildAnalyzePrompt } from './prompts'
import type { ExtractedContent, AnalysisResult } from '@/types/day6'

const AnalysisSchema = z.object({
  valueProp: z.object({
    statement: z.string(),
    confidence: z.enum(['high', 'mid', 'low']),
    evidence: z.string(),
  }),
  targetICP: z.object({
    description: z.string(),
    confidence: z.enum(['high', 'mid', 'low']),
    signals: z.array(z.string()),
  }),
  pricingModel: z.object({
    description: z.string(),
    confidence: z.enum(['high', 'mid', 'low']),
    signals: z.array(z.string()),
  }),
  gtmMotion: z.object({
    description: z.string(),
    confidence: z.enum(['high', 'mid', 'low']),
    signals: z.array(z.string()),
  }),
  weaknesses: z.array(z.object({
    title: z.string(),
    description: z.string(),
    severity: z.enum(['high', 'medium', 'low']),
    opportunity: z.string(),
    confidence: z.enum(['high', 'mid', 'low']),
  })),
  analysisNotes: z.string(),
})

// Helper for confidence enum schema
const confidenceEnum = {
  type: SchemaType.STRING as const,
  format: 'enum' as const,
  enum: ['high', 'mid', 'low'],
}

const severityEnum = {
  type: SchemaType.STRING as const,
  format: 'enum' as const,
  enum: ['high', 'medium', 'low'],
}

const geminiResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    valueProp: {
      type: SchemaType.OBJECT,
      properties: {
        statement: { type: SchemaType.STRING },
        confidence: confidenceEnum,
        evidence: { type: SchemaType.STRING },
      },
      required: ['statement', 'confidence', 'evidence'],
    },
    targetICP: {
      type: SchemaType.OBJECT,
      properties: {
        description: { type: SchemaType.STRING },
        confidence: confidenceEnum,
        signals: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      },
      required: ['description', 'confidence', 'signals'],
    },
    pricingModel: {
      type: SchemaType.OBJECT,
      properties: {
        description: { type: SchemaType.STRING },
        confidence: confidenceEnum,
        signals: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      },
      required: ['description', 'confidence', 'signals'],
    },
    gtmMotion: {
      type: SchemaType.OBJECT,
      properties: {
        description: { type: SchemaType.STRING },
        confidence: confidenceEnum,
        signals: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      },
      required: ['description', 'confidence', 'signals'],
    },
    weaknesses: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          severity: severityEnum,
          opportunity: { type: SchemaType.STRING },
          confidence: confidenceEnum,
        },
        required: ['title', 'description', 'severity', 'opportunity', 'confidence'],
      },
    },
    analysisNotes: { type: SchemaType.STRING },
  },
  required: ['valueProp', 'targetICP', 'pricingModel', 'gtmMotion', 'weaknesses', 'analysisNotes'],
}

export async function analyzeCompetitor(
  content: ExtractedContent
): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: geminiResponseSchema,
    },
  })

  const start = Date.now()

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: buildAnalyzePrompt(content) }] }],
  })

  const generationMs = Date.now() - start
  const responseText = result.response.text()
  const parsed = AnalysisSchema.parse(JSON.parse(responseText))

  console.log(
    `[gemini] domain=${content.domain} duration=${generationMs}ms ` +
    `vp_confidence=${parsed.valueProp.confidence} ` +
    `icp_confidence=${parsed.targetICP.confidence}`
  )

  return parsed
}
