import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import type { DigestChange, ChangeType } from "@/types/day18";

const CHANGE_TYPE_EMOJI: Record<ChangeType, string> = {
  pricing: "💰",
  feature: "🚀",
  hiring: "👥",
  messaging: "📢",
  other: "📋",
};

interface DigestEmailProps {
  changes: DigestChange[];
  date: string;
}

export function DigestEmail({ changes, date }: DigestEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>Your daily competitive intelligence digest</Text>
          <Text style={subheading}>{date}</Text>

          {changes.length === 0 ? (
            <Text style={quietText}>
              All quiet today — no changes detected on your watchlist.
            </Text>
          ) : (
            <>
              <Text style={summaryText}>
                {changes.length} change{changes.length > 1 ? "s" : ""} detected
                across{" "}
                {new Set(changes.map((c) => c.domain)).size} site
                {new Set(changes.map((c) => c.domain)).size > 1 ? "s" : ""}.
              </Text>

              {changes.map((change, i) => (
                <Section key={i} style={changeCard}>
                  <Text style={changeDomain}>
                    {CHANGE_TYPE_EMOJI[change.change_type]} {change.domain}
                  </Text>
                  <Text style={changeBadge}>
                    {change.change_type.toUpperCase()}
                  </Text>
                  <Text style={changeSummary}>{change.summary}</Text>
                  <Link href={change.url} style={changeLink}>
                    View page →
                  </Link>
                </Section>
              ))}
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Tracked {changes.length > 0 ? `${new Set(changes.map((c) => c.domain)).size} companies` : "your watchlist"} today
            {" · "}CompanyTracker — 30 in 30 Series
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#0A0A0A",
  fontFamily: "'DM Sans', system-ui, sans-serif",
  color: "#F5F0E8",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "32px 24px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "600" as const,
  marginBottom: "4px",
  color: "#F5F0E8",
};

const subheading = {
  fontSize: "14px",
  color: "#8A8580",
  marginBottom: "24px",
};

const summaryText = {
  fontSize: "14px",
  color: "#8A8580",
  marginBottom: "24px",
};

const quietText = {
  fontSize: "14px",
  color: "#8A8580",
  fontStyle: "italic" as const,
};

const changeCard = {
  backgroundColor: "#111111",
  border: "1px solid #262626",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
};

const changeDomain = {
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#F5F0E8",
  marginBottom: "4px",
};

const changeBadge = {
  fontSize: "10px",
  fontWeight: "700" as const,
  letterSpacing: "0.12em",
  color: "#E8A020",
  marginBottom: "8px",
};

const changeSummary = {
  fontSize: "14px",
  lineHeight: "1.65",
  color: "#F5F0E8",
  marginBottom: "8px",
};

const changeLink = {
  fontSize: "12px",
  color: "#E8A020",
  textDecoration: "none",
};

const hr = {
  borderColor: "#262626",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  color: "#5A5550",
};
