"use client"

import { useIam } from "@/hooks/useIam"
import FormAuth from "@/components/FormAuth"
import { redirect } from "next/navigation";
import { useLocale } from "next-intl";

export default function LoginPage() {
  const {query, isLoading} = useIam()
  const {data} = query;
  const locale = useLocale()

  if (!data) {
    return <FormAuth isLoading={isLoading} />
  }

  // user already logged
  redirect(`/${locale}/dashboard`)
}
