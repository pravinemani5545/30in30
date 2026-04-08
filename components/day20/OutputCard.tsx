"use client";

import { memo } from "react";
import { OUTPUT_TYPES } from "@/lib/day20/pipeline/outputs";
import { OutputTypeTag } from "./OutputTypeTag";
import { CopyButton } from "./CopyButton";
import { XThreadOutput } from "./XThreadOutput";
import { StandaloneTweetsOutput } from "./StandaloneTweetsOutput";
import { YouTubeOutput } from "./YouTubeOutput";
import { NewsletterOutput } from "./NewsletterOutput";
import { LinkedInOutput } from "./LinkedInOutput";
import { TikTokOutput } from "./TikTokOutput";
import { SummaryCardOutput } from "./SummaryCardOutput";
import type { OutputType, PipelineOutputs } from "@/types/day20";

interface OutputCardProps {
  outputType: OutputType;
  outputs: PipelineOutputs;
}

function getTextForCopy(outputType: OutputType, outputs: PipelineOutputs): string {
  switch (outputType) {
    case "summaryCard": {
      const sc = outputs.summaryCard;
      return `${sc.title}\n\nKey Points:\n${sc.keyPoints.map((p) => `- ${p}`).join("\n")}\n\nQuote: "${sc.quote}"\n\nPlatforms: ${sc.platforms.join(", ")}`;
    }
    case "xThread":
      return outputs.xThread.tweets
        .map((t, i) => `${i + 1}/${outputs.xThread.tweetCount} ${t}`)
        .join("\n\n");
    case "standaloneTweets":
      return outputs.standaloneTweets.join("\n\n---\n\n");
    case "youtubeDescription": {
      const yt = outputs.youtubeDescription;
      return `${yt.title}\n\n${yt.body}\n\nTimestamps:\n${yt.timestamps.map((ts) => `${ts.time} ${ts.label}`).join("\n")}\n\nTags: ${yt.tags.join(", ")}`;
    }
    case "newsletterSection":
      return `${outputs.newsletterSection.body}\n\n${outputs.newsletterSection.cta}`;
    case "linkedinPost":
      return outputs.linkedinPost;
    case "tiktokCaptions":
      return `Short: ${outputs.tiktokCaptions.short}\n\nMedium: ${outputs.tiktokCaptions.medium}\n\nLong: ${outputs.tiktokCaptions.long}`;
    default:
      return "";
  }
}

function renderContent(outputType: OutputType, outputs: PipelineOutputs) {
  switch (outputType) {
    case "summaryCard":
      return <SummaryCardOutput data={outputs.summaryCard} />;
    case "xThread":
      return <XThreadOutput data={outputs.xThread} />;
    case "standaloneTweets":
      return <StandaloneTweetsOutput tweets={outputs.standaloneTweets} />;
    case "youtubeDescription":
      return <YouTubeOutput data={outputs.youtubeDescription} />;
    case "newsletterSection":
      return <NewsletterOutput data={outputs.newsletterSection} />;
    case "linkedinPost":
      return <LinkedInOutput text={outputs.linkedinPost} />;
    case "tiktokCaptions":
      return <TikTokOutput data={outputs.tiktokCaptions} />;
    default:
      return null;
  }
}

function OutputCardInner({ outputType, outputs }: OutputCardProps) {
  const config = OUTPUT_TYPES.find((o) => o.key === outputType);
  if (!config) return null;

  const copyText = getTextForCopy(outputType, outputs);

  return (
    <div
      className="group relative transition-all duration-300 overflow-hidden"
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,255,65,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2a2a2a";
      }}
    >
      {/* Green top bar on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "#00FF41" }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <OutputTypeTag tag={config.tag} />
        <CopyButton text={copyText} />
      </div>

      {/* Content */}
      <div className="p-5">{renderContent(outputType, outputs)}</div>
    </div>
  );
}

export const OutputCard = memo(OutputCardInner);
