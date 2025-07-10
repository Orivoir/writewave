import { TranslateFn } from "@/lib/send-mail";

export function html(params: {
  userName: string;
  amount: number;
  currency: string;
  date: string;
  invoiceUrl: string;
  t: TranslateFn;
}) {
  const { userName, amount, currency, date, invoiceUrl, t } = params;

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>${t("emails.invoicePaymentSuccess.greeting", { name: userName })}</h1>
      <p>${t("emails.invoicePaymentSuccess.line1", {
        amount: amount.toFixed(2),
        currency: currency.toUpperCase(),
        date
      })}</p>
      <p>${t("emails.invoicePaymentSuccess.line2")} <a href="${invoiceUrl}">${t("emails.invoicePaymentSuccess.cta")}</a></p>
      <br/>
      <p>${t("emails.invoicePaymentSuccess.closing")}</p>
      <p>${t("emails.invoicePaymentSuccess.signature")}</p>
    </div>
  `;
}

export function text(params: {
  userName: string;
  amount: number;
  currency: string;
  date: string;
  invoiceUrl: string;
  t: TranslateFn;
}) {
  const { userName, amount, currency, date, invoiceUrl, t } = params;

  return `
${t("emails.invoicePaymentSuccess.greeting", { name: userName })}

${t("emails.invoicePaymentSuccess.line1", {
  amount: amount.toFixed(2),
  currency: currency.toUpperCase(),
  date
})}

${t("emails.invoicePaymentSuccess.line2")} ${invoiceUrl}

${t("emails.invoicePaymentSuccess.closing")}
${t("emails.invoicePaymentSuccess.signature")}
  `.trim();
}
