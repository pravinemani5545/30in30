import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface PriceDropAlertProps {
  productName: string;
  productUrl: string;
  currentPrice: number;
  targetPrice: number;
  savings: number;
  pct: number;
  currency: string;
  appUrl: string;
}

export function PriceDropAlert({
  productName,
  productUrl,
  currentPrice,
  targetPrice,
  savings,
  pct,
  currency,
  appUrl,
}: PriceDropAlertProps) {
  const symbol = currency === "USD" ? "$" : currency;

  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#0a0a0a",
          color: "#999",
          fontFamily: "monospace",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            padding: "32px",
            border: "1px solid #2a2a2a",
          }}
        >
          <Text
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#00FF41",
              opacity: 0.75,
              margin: "0 0 16px",
            }}
          >
            PRICE DROP ALERT
          </Text>

          <Text
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#eeeeee",
              margin: "0 0 24px",
            }}
          >
            {productName} hit your target price
          </Text>

          <Section
            style={{
              backgroundColor: "#111111",
              border: "1px solid #2a2a2a",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <Text style={{ margin: "0 0 8px", color: "#555" }}>
              Current price
            </Text>
            <Text
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#00FF41",
                margin: "0 0 16px",
              }}
            >
              {symbol}
              {currentPrice.toFixed(2)}
            </Text>
            <Text style={{ margin: "0 0 4px", color: "#555" }}>
              Your target: {symbol}
              {targetPrice.toFixed(2)}
            </Text>
            <Text style={{ margin: 0, color: "#00FF41" }}>
              You save: {symbol}
              {savings.toFixed(2)} ({pct}% off)
            </Text>
          </Section>

          <Link
            href={productUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#00FF41",
              color: "#000",
              fontWeight: 700,
              fontSize: "14px",
              padding: "16px 32px",
              textDecoration: "none",
              textAlign: "center",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Buy Now
          </Link>

          <Hr style={{ borderColor: "#2a2a2a", margin: "24px 0" }} />

          <Text style={{ fontSize: "12px", color: "#555", margin: 0 }}>
            You&apos;re tracking this with PriceTracker.{" "}
            <Link href={`${appUrl}/day31`} style={{ color: "#00FF41" }}>
              Manage your alerts
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
