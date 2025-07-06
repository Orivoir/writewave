"use client";

import SubscriptionButton from "@/atomes/SubscriptionButton";
import { useIam } from "@/hooks/useIam";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function SubscriptionButtonStorybookPage() {

  const {isLoading, query} = useIam()
  const router = useRouter()
  const locale = useLocale()

  if(isLoading) {
    return <>Chargement ...</>
  }

  if(!query.data?.user && !isLoading) {
    router.push(`/${locale}/login`)
  }

  return (
    <>
    <>logged as: {query.data?.user?.email}</>
    <br />
    <SubscriptionButton />
    </>
  )
}