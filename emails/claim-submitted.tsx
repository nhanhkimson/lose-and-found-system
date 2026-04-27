import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type ClaimSubmittedEmailProps = {
  itemTitle: string;
  building: string;
  categoryLabel: string;
  claimantName: string;
  claimantEmail: string | null;
  claimMessagePreview: string;
  reviewUrl: string;
};

export default function ClaimSubmittedEmail({
  itemTitle,
  building,
  categoryLabel,
  claimantName,
  claimantEmail,
  claimMessagePreview,
  reviewUrl,
}: ClaimSubmittedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New claim on: {itemTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Build Bright University</Text>
            <Heading as="h1" style={h1}>
              Lost &amp; Found
            </Heading>
            <div style={goldBar} />
          </Section>
          <Section style={body}>
            <Text style={text}>A new claim was submitted and needs your review.</Text>
            <Heading as="h2" style={h2}>
              Item
            </Heading>
            <Text style={text}>
              <strong>{itemTitle}</strong>
            </Text>
            <Text style={muted}>
              {categoryLabel} · {building}
            </Text>
            <Heading as="h2" style={h2}>
              Claimant
            </Heading>
            <Text style={text}>{claimantName}</Text>
            {claimantEmail ? (
              <Text style={muted}>{claimantEmail}</Text>
            ) : null}
            <Heading as="h2" style={h2}>
              Message (excerpt)
            </Heading>
            <Text style={excerpt}>{claimMessagePreview}</Text>
            <Hr style={hr} />
            <Section style={{ textAlign: "center" as const }}>
              <Button href={reviewUrl} style={button}>
                Review in admin panel
              </Button>
            </Section>
            <Text style={footer}>
              This message was sent by the BIU Lost &amp; Found system. If you are not an administrator,
              you can ignore this email.
            </Text>
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
  lineHeight: "1.5",
  margin: "0 0 8px",
};

const muted = {
  color: "#71717a",
  fontSize: "14px",
  margin: "0 0 8px",
};

const excerpt = {
  color: "#3f3f46",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  maxHeight: "120px",
  overflow: "hidden",
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "24px 0",
};

const button = {
  backgroundColor: "#B8860B",
  color: "#1a1a2e",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  borderRadius: "8px",
};

const footer = {
  color: "#a1a1aa",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "24px 0 0",
};
