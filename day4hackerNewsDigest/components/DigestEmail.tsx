import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { SummarizedStory } from "@/types";

interface DigestEmailProps {
  stories: SummarizedStory[];
  dateString: string;
  unsubscribeUrl: string;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "#22C55E";
  if (score >= 5) return "#E8A020";
  return "#8A8580";
}

function getScoreLabel(score: number): string {
  if (score >= 8) return "High";
  if (score >= 5) return "Mid";
  return "Low";
}

export default function DigestEmail({
  stories,
  dateString,
  unsubscribeUrl,
}: DigestEmailProps) {
  const topStory = stories[0];

  return (
    <Html>
      <Head />
      <Preview>Top story: {topStory?.title ?? "HN Digest"}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={{ padding: "32px 24px 0" }}>
            <Heading style={headingStyle}>HN Digest</Heading>
            <Text style={dateStyle}>{dateString}</Text>
            <Hr style={amberRule} />
          </Section>

          {/* Stories */}
          <Section style={{ padding: "0 24px" }}>
            {stories.map((story, index) => (
              <Section key={story.id} style={{ marginBottom: "24px" }}>
                <Text style={rankStyle}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Link
                  href={story.hnUrl}
                  style={titleLinkStyle}
                >
                  {story.title}
                </Link>
                {story.domain && (
                  <Text style={domainStyle}>{story.domain}</Text>
                )}
                <Text style={metaStyle}>
                  {story.score} pts · {story.descendants} comments
                  <span style={{ marginLeft: "8px" }}>
                    <span
                      style={{
                        ...scoreBadge,
                        color: getScoreColor(story.relevanceScore),
                        backgroundColor: `${getScoreColor(story.relevanceScore)}22`,
                      }}
                    >
                      {getScoreLabel(story.relevanceScore)}{" "}
                      ({story.relevanceScore}/10)
                    </span>
                  </span>
                </Text>
                <Text style={summaryStyle}>{story.summary}</Text>
                {story.reason && !story.parseError && (
                  <Text style={reasonStyle}>→ {story.reason}</Text>
                )}
                {index < stories.length - 1 && <Hr style={dividerStyle} />}
              </Section>
            ))}
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Hr style={dividerStyle} />
            <Link href={unsubscribeUrl} style={unsubscribeStyle}>
              Unsubscribe
            </Link>
            <Text style={footerTextStyle}>
              Built in one day — Day 4 of 30 apps in 30 days
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#0A0A0A",
  fontFamily:
    "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: "24px 0",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#111111",
  border: "1px solid #262626",
  borderRadius: "8px",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "28px",
  fontWeight: 400,
  color: "#F5F0E8",
  margin: "0 0 4px",
};

const dateStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#8A8580",
  margin: "0 0 16px",
};

const amberRule: React.CSSProperties = {
  borderTop: "2px solid #E8A020",
  margin: "0 0 24px",
};

const rankStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "12px",
  color: "#555250",
  margin: "0 0 4px",
};

const titleLinkStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 500,
  color: "#F5F0E8",
  textDecoration: "none",
  lineHeight: "1.4",
};

const domainStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#8A8580",
  margin: "4px 0 0",
};

const metaStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#555250",
  margin: "8px 0",
};

const scoreBadge: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 500,
  padding: "2px 8px",
  borderRadius: "4px",
  display: "inline",
};

const summaryStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#8A8580",
  lineHeight: "1.5",
  margin: "0",
};

const reasonStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#E8A020",
  lineHeight: "1.4",
  margin: "6px 0 0",
  fontStyle: "italic",
};

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid #262626",
  margin: "0",
};

const footerSection: React.CSSProperties = {
  padding: "16px 24px 24px",
};

const unsubscribeStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#555250",
  textDecoration: "underline",
  display: "block",
  marginTop: "16px",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#555250",
  margin: "8px 0 0",
};
