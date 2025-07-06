"use client";

import { useState } from 'react';
import { Switch, Button, Typography, Box, Paper, Divider, Select, MenuItem, Backdrop, CircularProgress, Avatar } from '@mui/material';
import { signOut} from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useThemeContext } from '@/context/ThemeContext';
import { useIam } from '@/hooks/useIam';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('fr');
  const {query, isLoading} = useIam()
  const locale = useLocale()
  const {mode, toggleTheme} = useThemeContext()

  const {data} = query;

  const handleLogout = () => {
    signOut({callbackUrl: `/${locale}/login`})
  };

  return (
    <Box p={4}>
      <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
      >
      <CircularProgress color="inherit" />
    </Backdrop>

    <Typography variant="h4" gutterBottom>Paramètres</Typography>

    <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6">Compte</Typography>
      <Box mt={2}>
        <Avatar sx={{width: 32, height: 32}} alt={`avatar ${data?.user.name}`} src={data?.user?.image || ""} />
        <Typography>{data?.user?.email}</Typography>
        <Typography>Authentification via: Google</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mt: 2 }}>Se déconnecter</Button>
      </Box>
    </Paper>

    <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6">Abonnement</Typography>
      <Box mt={2}>
        <Typography>Plan actuel: {data?.user?.role}</Typography>

        {data?.user?.role === "premium" && (
          <Typography>Prochaine échéance: 25/07/2025</Typography>
        )}
        <Button variant="outlined" sx={{ mt: 2 }}>Gérer mon abonnement</Button>
      </Box>
    </Paper>

    <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6">Préférences</Typography>
      <Box mt={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography>Thème</Typography>
          <Select value={mode} onChange={(e) => toggleTheme()}>
            <MenuItem value="light">Clair</MenuItem>
            <MenuItem value="dark">Sombre</MenuItem>
          </Select>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>Langue</Typography>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <MenuItem value="fr">Français</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </Box>
      </Box>
    </Paper>

    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6">Notifications</Typography>
      <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography>Emails</Typography>
        <Switch checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
      </Box>
    </Paper>
    </Box>
  );
}
