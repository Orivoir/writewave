import nodemailer from "nodemailer";
import { createTranslator } from "next-intl";

export type TranslateFn = (key: string, values?: Record<string, any>) => string

export type TemplateName =
  | "subscription-updated"
  | "subscription-deleted"
  | "subscription-created"
  | "checkout-completed"
  | "invoice-payment-success"
  | "invoice-payment-failed"
  | "subscription-trial-will-end"
  | "subscription-trial-ended"
  | "payment-incomplete"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASS,
  },
});

async function loadTemplate(name: TemplateName, params: Record<string, any>) {
  try {
    const { html, text } = await import(`@/templates/${name}`);
    return {
      html: html(params),
      text: text ? text(params) : html(params).replace(/<[^>]+>/g, "")
    };
  } catch (e) {
    throw new Error(`Template '${name}' not found or invalid: ${e}`);
  }
}

export async function getTranslator(locale: "fr" | "en") {
  const messages = await import(`@/messages/${locale}.json`).then(_module => _module.default)
  return createTranslator({ locale, messages })
}

export type SendMailOptions = {
  to: string;
  subject: string;
  template: TemplateName;
  params?: Record<string, any>;
  locale?: "fr" | "en"
};



export async function sendMail({ to, subject, template, params = {}, locale = "en" }: SendMailOptions) {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is not defined in .env");

  const t = await getTranslator(locale)

  const { html, text } = await loadTemplate(template, {...params, t});


  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });

  console.log(`📤 Email sent to ${to}: ${info.messageId}`);
}
