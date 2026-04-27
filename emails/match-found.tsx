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

export type MatchFoundEmailProps = {
  yourItemTitle: string;
  matchItemTitle: string;
  matchItemUrl: string;
  categoryLabel: string;
  building: string;
};

export default function MatchFoundEmail({
  yourItemTitle,
  matchItemTitle,
  matchItemUrl,
  categoryLabel,
  building,
}: MatchFoundEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Possible match for your listing: {matchItemTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Build Bright University</Text>
            <Heading as="h1" style={h1}>
              Possible match
            </Heading>
            <div style={goldBar} />
          </Section>
          <Section style={body}>
            <Text style={text}>
              We found a <strong>counterpart listing</strong> that may relate to your post{" "}
              <strong>“{yourItemTitle}”</strong>.
            </Text>
            <Heading as="h2" style={h2}>
              Matching listing
            </Heading>
            <Text style={text}>
              <strong>{matchItemTitle}</strong>
            </Text>
            <Text style={muted}>
              {categoryLabel} · {building}
            </Text>
            <Hr style={hr} />
            <Section style={{ textAlign: "center" as const }}>
              <Button href={matchItemUrl} style={button}>
                Open listing
              </Button>
            </Section>
            <Text style={footer}>
              Suggestions are automatic and may not always be perfect. See all matches on your dashboard in the
              app.
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
  margin: "16px 0 8px",
};

const text = {
  color: "#27272a",
  fontSize: "15px",
  lineHeight: "1.55",
  margin: "0 0 12px",
};

const muted = {
  color: "#71717a",
  fontSize: "14px",
  margin: "0 0 8px",
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
  margin: "12px 0 0",
};
