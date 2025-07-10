import { TranslateFn } from "@/lib/send-mail";

export function html(params: { userName: string; t: TranslateFn }) {
  const { userName, t } = params;

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>${t("emails.checkoutCompleted.greeting")}, ${userName} !</h1>
      <p>${t("emails.checkoutCompleted.line1")}</p>
      <p>${t("emails.checkoutCompleted.line2")}</p>
      <p>${t("emails.checkoutCompleted.line3")}</p>
      <br/>
      <p>${t("emails.common.closing")}</p>
      <p>${t("emails.common.signature")}</p>
    </div>
  `;
}


export function text(params: { userName: string; t: TranslateFn }) {
  const { userName, t } = params;

  return `
${t("emails.checkoutCompleted.greeting")}, ${userName} !

${t("emails.checkoutCompleted.line1")}

${t("emails.checkoutCompleted.line2")}

${t("emails.checkoutCompleted.line3")}

${t("emails.common.closing")}

${t("emails.common.signature")}
  `.trim();
}
