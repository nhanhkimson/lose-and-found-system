import { render } from "@react-email/render";
import { Resend } from "resend";
import ClaimApprovedEmail from "../../emails/claim-approved";
import ClaimRejectedEmail from "../../emails/claim-rejected";
import ClaimSubmittedEmail from "../../emails/claim-submitted";
import MatchFoundEmail from "../../emails/match-found";
import { CATEGORY_LABEL } from "@/lib/utils/constants";
import type { ItemCategory } from "@prisma/client";

function getAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function getFrom(): string {
  return process.env.EMAIL_FROM ?? "BIU Lost & Found <onboarding@resend.dev>";
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function sendHtml(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[mail] RESEND_API_KEY is not set; skipping email:", subject);
    }
    return;
  }
  const { error } = await resend.emails.send({
    from: getFrom(),
    to: [to],
    subject,
    html,
  });
  if (error) {
    console.error("[mail] Resend error:", error);
  }
}

export async function sendClaimSubmittedEmail(params: {
  to: string;
  itemTitle: string;
  building: string;
  category: ItemCategory;
  claimantName: string;
  claimantEmail: string | null;
  claimMessage: string;
  claimId: string;
}): Promise<void> {
  const reviewUrl = `${getAppUrl()}/admin/claims`;
  const html = await render(
    <ClaimSubmittedEmail
      itemTitle={params.itemTitle}
      building={params.building}
      categoryLabel={CATEGORY_LABEL[params.category]}
      claimantName={params.claimantName}
      claimantEmail={params.claimantEmail}
      claimMessagePreview={params.claimMessage.slice(0, 400)}
      reviewUrl={reviewUrl}
    />,
  );
  await sendHtml(
    params.to,
    `[BIU Lost & Found] New claim: ${params.itemTitle}`,
    html,
  );
}

export async function sendClaimApprovedEmail(params: {
  to: string;
  itemId: string;
  itemTitle: string;
  recipientName: string | null;
}): Promise<void> {
  const itemUrl = `${getAppUrl()}/items/${params.itemId}`;
  const html = await render(
    <ClaimApprovedEmail
      itemTitle={params.itemTitle}
      itemUrl={itemUrl}
      recipientName={params.recipientName}
    />,
  );
  await sendHtml(
    params.to,
    `Your claim was approved: ${params.itemTitle}`,
    html,
  );
}

export async function sendClaimRejectedEmail(params: {
  to: string;
  itemTitle: string;
  recipientName: string | null;
  adminNote: string | null;
}): Promise<void> {
  const claimsUrl = `${getAppUrl()}/claims`;
  const html = await render(
    <ClaimRejectedEmail
      itemTitle={params.itemTitle}
      recipientName={params.recipientName}
      adminNote={params.adminNote}
      claimsUrl={claimsUrl}
    />,
  );
  await sendHtml(
    params.to,
    `Update on your claim: ${params.itemTitle}`,
    html,
  );
}

export async function sendMatchFoundEmail(params: {
  to: string;
  yourItemTitle: string;
  matchItemId: string;
  matchItemTitle: string;
  category: ItemCategory;
  building: string;
}): Promise<void> {
  const matchItemUrl = `${getAppUrl()}/items/${params.matchItemId}`;
  const html = await render(
    <MatchFoundEmail
      yourItemTitle={params.yourItemTitle}
      matchItemTitle={params.matchItemTitle}
      matchItemUrl={matchItemUrl}
      categoryLabel={CATEGORY_LABEL[params.category]}
      building={params.building}
    />,
  );
  await sendHtml(
    params.to,
    `Possible match: ${params.matchItemTitle}`,
    html,
  );
}
