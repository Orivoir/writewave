import { TranslateFn } from "@/lib/send-mail";

export function html(params: {
  userName: string;
  paymentUrl: string;
  t: TranslateFn;
}) {
  const { userName, paymentUrl, t } = params;

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>${t("emails.paymentIncomplete.greeting", { name: userName })}</h1>
      <p>${t("emails.paymentIncomplete.line1")}</p>
      <p>${t("emails.paymentIncomplete.line2", { url: paymentUrl })}</p>
      <br/>
      <p>${t("emails.paymentIncomplete.closing")}</p>
      <p>${t("emails.paymentIncomplete.signature")}</p>
    </div>
  `;
}

export function text(params: {
  userName: string;
  paymentUrl: string;
  t: TranslateFn;
}) {
  const { userName, paymentUrl, t } = params;

  return `
${t("emails.paymentIncomplete.greeting", { name: userName })}

${t("emails.paymentIncomplete.line1")}

${t("emails.paymentIncomplete.line2Text", { url: paymentUrl })}

${t("emails.paymentIncomplete.closing")}
${t("emails.paymentIncomplete.signature")}
  `.trim();
}
