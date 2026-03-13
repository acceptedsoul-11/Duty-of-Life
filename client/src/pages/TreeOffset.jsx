import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { createOffset, fetchTreeDashboard } from "../api/client";

export default function TreeOffset() {
  const [form, setForm] = useState({ monthlyEmissionKg: 150, treesPlanted: 7, location: "", sponsor: "CSR Partner" });
  const [result, setResult] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const loadDashboard = async () => {
    const data = await fetchTreeDashboard();
    setDashboard(data);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onOffset = async () => {
    const data = await createOffset({ ...form });
    setResult(data);
    loadDashboard();
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            color: "#fff",
            backgroundImage:
              "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mb: 2
          }}
        >
          <Typography variant="h5">Tree Planting Carbon Offset</Typography>
          <Typography variant="body2">Convert emissions into measurable tree-based offsets and watch your impact grow.</Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Monthly CO2 (kg)"
              value={form.monthlyEmissionKg}
              onChange={(e) => setForm({ ...form, monthlyEmissionKg: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Trees to plant"
              value={form.treesPlanted}
              onChange={(e) => setForm({ ...form, treesPlanted: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button sx={{ height: "100%" }} fullWidth variant="contained" onClick={onOffset}>
              Offset Carbon
            </Button>
          </Grid>
        </Grid>

        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography>Required trees: {result.requiredTrees}</Typography>
            <Typography>Total offset from this action: {result.co2Offset} kg CO2/year</Typography>
          </Box>
        )}

        {dashboard && (
          <Box sx={{ mt: 2 }}>
            <Typography>Total trees planted: {dashboard.totalTrees}</Typography>
            <Typography>Total CO2 offset: {dashboard.totalOffset} kg</Typography>
            <motion.div
              initial={{ scaleY: 0.2, opacity: 0.3 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              style={{ transformOrigin: "bottom", width: 40, height: 90, background: "#4E9F3D", borderRadius: 16, marginTop: 12 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
