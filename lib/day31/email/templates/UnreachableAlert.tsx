import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface UnreachableAlertProps {
  productName: string;
  appUrl: string;
}

export function UnreachableAlert({
  productName,
  appUrl,
}: UnreachableAlertProps) {
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
              color: "#ff4444",
              opacity: 0.75,
              margin: "0 0 16px",
            }}
          >
            PRODUCT UNREACHABLE
          </Text>

          <Text
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#eeeeee",
              margin: "0 0 24px",
            }}
          >
            Can&apos;t reach {productName}
          </Text>

          <Text style={{ lineHeight: "1.8", margin: "0 0 24px" }}>
            We&apos;ve failed to extract price data from this product 5 times in
            a row. We&apos;ve paused tracking for it. You can re-enable it from
            your dashboard.
          </Text>

          <Hr style={{ borderColor: "#2a2a2a", margin: "24px 0" }} />

          <Text style={{ fontSize: "12px", color: "#555", margin: 0 }}>
            <Link href={`${appUrl}/day31`} style={{ color: "#00FF41" }}>
              Go to dashboard
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
