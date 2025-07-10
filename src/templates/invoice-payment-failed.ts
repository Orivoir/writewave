import { TranslateFn } from "@/lib/send-mail";

export function html(params: {
  userName: string;
  amount: number;
  currency: string;
  dueDate: string | null;
  t: TranslateFn;
}) {
  const { userName, amount, currency, dueDate, t } = params;

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>${t("emails.invoicePaymentFailed.greeting", { name: userName })}</h1>
      <p>${t("emails.invoicePaymentFailed.line1", {
        amount: amount.toFixed(2),
        currency: currency.toUpperCase()
      })}</p>
      <p>${
        dueDate
          ? t("emails.invoicePaymentFailed.line2WithDueDate", { dueDate })
          : t("emails.invoicePaymentFailed.line2WithoutDueDate")
      }</p>
      <p>${t("emails.invoicePaymentFailed.cta")}</p>
      <br />
      <p>${t("emails.invoicePaymentFailed.closing")}</p>
      <p>${t("emails.invoicePaymentFailed.signature")}</p>
    </div>
  `;
}

export function text(params: {
  userName: string;
  amount: number;
  currency: string;
  dueDate: string | null;
  t: (key: string, values?: Record<string, any>) => string;
}) {
  const { userName, amount, currency, dueDate, t } = params;

  return `
${t("emails.invoicePaymentFailed.greeting", { name: userName })}

${t("emails.invoicePaymentFailed.line1", {
  amount: amount.toFixed(2),
  currency: currency.toUpperCase()
})}

${
  dueDate
    ? t("emails.invoicePaymentFailed.line2WithDueDate", { dueDate })
    : t("emails.invoicePaymentFailed.line2WithoutDueDate")
}

${t("emails.invoicePaymentFailed.cta")}

${t("emails.invoicePaymentFailed.closing")}
${t("emails.invoicePaymentFailed.signature")}
  `.trim();
}
