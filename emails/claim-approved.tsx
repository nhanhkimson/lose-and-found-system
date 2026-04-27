import {
  Body,
  Button,
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

export type ClaimApprovedEmailProps = {
  itemTitle: string;
  itemUrl: string;
  recipientName: string | null;
};

export default function ClaimApprovedEmail({
  itemTitle,
  itemUrl,
  recipientName,
}: ClaimApprovedEmailProps) {
  const greeting = recipientName ? `Hi ${recipientName},` : "Hello,";
  return (
    <Html>
      <Head />
      <Preview>Your claim for “{itemTitle}” was approved</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Build Bright University</Text>
            <Heading as="h1" style={h1}>
              Claim approved
            </Heading>
            <div style={goldBar} />
          </Section>
          <Section style={body}>
            <Text style={text}>{greeting}</Text>
            <Text style={text}>
              Congratulations — your claim for <strong>{itemTitle}</strong> has been{" "}
              <strong>approved</strong> by the Lost &amp; Found team.
            </Text>
            <Heading as="h2" style={h2}>
              Next steps
            </Heading>
            <Text style={text}>
              1. Open the item page to see full details and contact information if the poster shared it.
            </Text>
            <Text style={text}>
              2. Coordinate with campus security or the contact on the listing if you need to collect the item
              in person.
            </Text>
            <Text style={text}>
              3. If something does not look right, reply to this email thread or use the in-app help.
            </Text>
            <Hr style={hr} />
            <Section style={{ textAlign: "center" as const }}>
              <Button href={itemUrl} style={button}>
                View item
              </Button>
            </Section>
            <Text style={muted}>
              Or copy this link: <Link href={itemUrl}>{itemUrl}</Link>
            </Text>
            <Text style={footer}>
              — BIU Lost &amp; Found
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
  fontSize: "15px",
  fontWeight: 600,
  margin: "20px 0 8px",
};

const text = {
  color: "#27272a",
  fontSize: "15px",
  lineHeight: "1.55",
  margin: "0 0 12px",
};

const muted = {
  color: "#71717a",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "16px 0 0",
  wordBreak: "break-all" as const,
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
  margin: "24px 0 0",
};
