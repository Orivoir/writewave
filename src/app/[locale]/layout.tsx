import { notFound } from "next/navigation";

import { NextIntlClientProvider } from "next-intl";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeContextProvider } from "@/context/ThemeContext";
import SessionWrapper from "@/components/SessionWrapper";
import QueryClientWrapper from "@/components/QueryClientWrapper";

import { Roboto } from "next/font/google";
import { locales } from "@/lib/i18n";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Writewave",
  description:
    "Create, publish, and discover ebooks online with our powerful ebook platform. Supports customizable metadata, dynamic chapter navigation, and advanced search to boost your reading experience.",
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default async function LocaleLayout({children, params}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const {locale} = await params;

  if (!locales.includes(locale as any)) notFound();

  return (
    <html lang={locale} className={roboto.variable}>
      <body>
        <SessionWrapper>
          <NextIntlClientProvider>
            <AppRouterCacheProvider>
              <ThemeContextProvider>
                <QueryClientWrapper>
                  {children}
                </QueryClientWrapper>
              </ThemeContextProvider>
            </AppRouterCacheProvider>
          </NextIntlClientProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
