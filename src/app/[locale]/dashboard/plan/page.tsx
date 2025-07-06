"use client";

import {
  Table,
  TableContainer,
  Paper,
  Typography,
  Box,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import Admin from "@/components/Plan/Admin"
import CurrentPlan from "@/components/Plan/CurrentPlan";
import {default as PlanTableHead} from "@/components/Plan/TableHead"
import {default as PlanTableBody} from "@/components/Plan/TableBody"
import { useIam } from "@/hooks/useIam";

export type FeatureKey = keyof typeof plansData.free.features | keyof typeof plansData.premium.features;

export const plansData = {
  free: {
    title: "Free Plan",
    price: "0€ / month",
    features: {
      "Création illimitée d’ebooks": {
        checked: false,
        aside: "3 ebooks"
      },
      "Insertion d'images": {
        checked: true,
        aside: "5 par ebooks"
      },
      "Volumes des images illimités": {
        checked: false,
        aside: "2 Mo par images"
      },
      "Personnalisation de thèmes": {
        checked: true,
        aside: "1 thème"
      },
      "Accès au thèmes premium": {
        checked: false,
      },
      "Publicités": {
        checked: true,
        aside: "non intrusive"
      },
      "Importations Ebooks/Epub": {
        checked: false
      },
      "Analytics avancées de lecture": {
        checked: false
      },
      "Support prioritaire": {
        checked: false
      },
    },
  },
  premium: {
    title: "Premium Plan",
    price: "6,99€ / month",
    features: {
      "Création illimitée d’ebooks": {
        checked: true
      },
      "Insertion d'images": {
        checked: true,
        aside: "illimité"
      },
      "Volumes des images illimités": {
        checked: false,
        aside: "10 Mo par images"
      },
      "Personnalisation de thèmes": {
        checked: true,
        aside: "Illimité"
      },
      "Accès au thèmes premium": {
        checked: true,
      },
      "Publicités": {
        checked: false,
      },
      "Importations Ebooks/Epub": {
        checked: true
      },
      "Analytics avancées de lecture": {
        checked: true
      },
      "Support prioritaire": {
        checked: true
      }
    },
  },
};

// Union des features pour couvrir tous les cas
export const featureList = Array.from(
  new Set([
    ...Object.keys(plansData.free.features),
    ...Object.keys(plansData.premium.features),
  ])
) as FeatureKey[]


export default function PlanComparisonTable() {
  const { query, isLoading } = useIam();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "free">("free")

  const {data} = query

  if (!isLoading && data?.user.role === "admin") {
    return (<Admin />);
  }

  async function handleUpdatePlan() {
    setLoading(true);

    // Simuler une requête async (ex: appel API)
    await new Promise((r) => setTimeout(r, 1500));

    setLoading(false);

    // Ici tu peux lancer une vraie action, ex: mutation pour update le plan utilisateur
    alert(`Plan mis à jour`);
  }

  return (
    <Box maxWidth={700} mx="auto" p={3} position="relative">
      <Typography variant="h4" mb={1} textAlign="center">
        Choisissez votre offre
      </Typography>
      {data?.user?.role && (<CurrentPlan role={data.user.role} />)}

      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="Comparatif des plans">
          <PlanTableHead
            plan={selectedPlan}
            onChangePlan={(newPlan) => setSelectedPlan(newPlan)}
            free={{title: plansData.free.title, price: plansData.free.price}}
            premium={{price: plansData.premium.price, title: plansData.premium.title}}
          />

          <PlanTableBody />
        </Table>
      </TableContainer>

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleUpdatePlan}
          disabled={loading}
        >
          Mettre à niveau
        </Button>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
