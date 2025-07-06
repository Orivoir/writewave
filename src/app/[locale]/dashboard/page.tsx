"use client";

import { useEbooks } from "@/hooks/useEbooks"
import PreviewEbooks from "@/components/PreviewEbooks";
import PreviewStats from "@/components/PreviewStats";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import { Typography } from "@mui/material";

/**
 * @TODO 3th party: enrichir le models ebooks via une collection ebookStats pour remplacer les fixtures
 */
const statsFixtures = { sold: 12, downloads: 40, views: 100, likes: 22 }

export default function DashboardPage() {

  const {getEbooks} = useEbooks()

  return (
    <>
    <SubscriptionBanner />
    
    <Typography variant="h6" gutterBottom>Vos dernières editions</Typography>
    <PreviewEbooks
      ebooks={getEbooks.data?.docs || []}
      isLoading={getEbooks.isLoading}
    />

    <PreviewStats stats={statsFixtures} />  
    </>
  )
}