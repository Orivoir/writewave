"use client"
import DashboardHeader from "@/components/DashboardHeader";
import DashboardHeaderSkeleton from "@/components/DashboardHeader/Skeleton";
import DrawerMenu from "@/components/DrawerMenu";
import { useIam } from "@/hooks/useIam";
import { Box } from "@mui/material";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function LoggedLayout({children}: Props) {

  const {query, isLoading} = useIam()
  const locale = useLocale()

  const [isOpenDrawerMenu, setIsOpenDrawerMenu] = useState<boolean>(false)

  const {data} = query;

  if(!isLoading && !data) {
    redirect(`/${locale}/login`)
  }

  return (
    <>
    {isLoading && (
      <DashboardHeaderSkeleton />
    )}
    {data?.user && (
      <DashboardHeader
        user={data.user}
        onMenuToggle={() => (
          setIsOpenDrawerMenu(status => !status)
        )} />
    )}

    <DrawerMenu
      open={isOpenDrawerMenu}
      onOpen={() => setIsOpenDrawerMenu(true)}
      onClose={() => setIsOpenDrawerMenu(false)}
    />

    <Box
      component="main"
      sx={{
        px: { xs: 2, sm: 4 },
        py: { xs: 2, sm: 4 },
        maxWidth: "1200px",
        mx: "auto",
        width: "100%",
      }}
    >
      {children}
    </Box>
    </>
  )
}