import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsData {
  sold: number;
  downloads: number;
  views: number;
  likes: number;
}

export default function DashboardStatsPreview({ stats }: { stats: StatsData }) {
  const data = [
    { name: 'Vendus', value: stats.sold },
    { name: 'Téléchargements', value: stats.downloads },
    { name: 'Vues', value: stats.views },
    { name: 'Likes', value: stats.likes },
  ];

  return (
    <Box sx={{ width: '100%', height: 250, mt: 4 }}>
      <Typography variant="h6" gutterBottom>Statistiques rapides</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
