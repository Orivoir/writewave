import { TranslateFn } from "@/lib/send-mail";

export function html(params: {
  trialEndAt?: number;
  userName: string;
  t: TranslateFn;
}) {
  const { trialEndAt, userName, t } = params;

  const trialEndDate = trialEndAt
    ? new Date(trialEndAt * 1000).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>${t("emails.subscriptionCreated.greeting", { name: userName })}</h1>
      <p>${
        trialEndDate
          ? t("emails.subscriptionCreated.withTrial", { trialEndDate })
          : t("emails.subscriptionCreated.withoutTrial")
      }</p>
      <p>${t("emails.subscriptionCreated.cta")}</p>
      <br/>
      <p>${t("emails.subscriptionCreated.closing")}</p>
      <p>${t("emails.subscriptionCreated.signature")}</p>
    </div>
  `;
}

export function text(params: {
  trialEndAt?: number;
  userName: string;
  t: TranslateFn;
}) {
  const { trialEndAt, userName, t } = params;

  const trialEndDate = trialEndAt
    ? new Date(trialEndAt * 1000).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return `
${t("emails.subscriptionCreated.greeting", { name: userName })}

${
  trialEndDate
    ? t("emails.subscriptionCreated.withTrial", { trialEndDate })
    : t("emails.subscriptionCreated.withoutTrial")
}

${t("emails.subscriptionCreated.cta")}

${t("emails.subscriptionCreated.closing")}
${t("emails.subscriptionCreated.signature")}
  `.trim();
}
