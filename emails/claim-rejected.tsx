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

export type ClaimRejectedEmailProps = {
  itemTitle: string;
  recipientName: string | null;
  adminNote: string | null;
  claimsUrl: string;
};

export default function ClaimRejectedEmail({
  itemTitle,
  recipientName,
  adminNote,
  claimsUrl,
}: ClaimRejectedEmailProps) {
  const greeting = recipientName ? `Hi ${recipientName},` : "Hello,";
  return (
    <Html>
      <Head />
      <Preview>Update on your claim for “{itemTitle}”</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Build Bright University</Text>
            <Heading as="h1" style={h1}>
              Claim not approved
            </Heading>
            <div style={goldBar} />
          </Section>
          <Section style={body}>
            <Text style={text}>{greeting}</Text>
            <Text style={text}>
              Your claim for <strong>{itemTitle}</strong> was not approved. You can still browse other listings
              and submit a new claim when appropriate.
            </Text>
            {adminNote ? (
              <>
                <Heading as="h2" style={h2}>
                  Note from the team
                </Heading>
                <Text style={excerpt}>{adminNote}</Text>
              </>
            ) : null}
            <Hr style={hr} />
            <Text style={muted}>
              View your claims:{" "}
              <Link href={claimsUrl} style={linkOnly}>
                My claims
              </Link>
            </Text>
            <Text style={footer}>— BIU Lost &amp; Found</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const goldBar = {
  height: "4px",
  width: "100%",
  backgroundColor: "#B8860B",
  borderRadius: "2px",
  marginTop: "12px",
};

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "32px 16px",
  maxWidth: "560px",
};

const header = {
  backgroundColor: "#1a1a2e",
  borderRadius: "8px 8px 0 0",
  padding: "24px",
};

const brand = {
  color: "#B8860B",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  margin: "0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: 700,
  margin: "8px 0 0",
};

const body = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderTop: "none",
  borderRadius: "0 0 8px 8px",
  padding: "24px",
};

const h2 = {
  color: "#1a1a2e",
  fontSize: "14px",
  fontWeight: 600,
  margin: "20px 0 8px",
};

const text = {
  color: "#27272a",
  fontSize: "15px",
  lineHeight: "1.55",
  margin: "0 0 12px",
};

const excerpt = {
  color: "#3f3f46",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "24px 0",
};

const muted = {
  color: "#71717a",
  fontSize: "13px",
  margin: "0",
};

const linkOnly = {
  color: "#1a1a2e",
  textDecoration: "underline",
};

const footer = {
  color: "#a1a1aa",
  fontSize: "12px",
  margin: "20px 0 0",
};
