import { useState } from "react";
import { Box, Button, Card, CardContent, Chip, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { calculateEmission } from "../api/client";

const transportModes = ["car", "bus", "train", "bicycle", "walking", "flight"];

export default function CommuteTracker() {
  const [form, setForm] = useState({
    start: "Home",
    destination: "Office",
    mode: "car",
    distanceKm: 12
  });
  const [result, setResult] = useState(null);

  const onCalculate = async () => {
    const response = await calculateEmission({ ...form });
    setResult(response);
  };

  return (
    <Card sx={{ background: "linear-gradient(140deg, rgba(27,153,139,0.15), rgba(255,140,0,0.15))" }}>
      <CardContent>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            color: "#fff",
            backgroundImage:
              "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mb: 2
          }}
        >
          <Typography variant="h5">Commute Emission Tracker</Typography>
          <Typography variant="body2">Track your daily travel footprint and discover cleaner transport choices.</Typography>
          <Typography variant="caption">Catchphrase: "Choose the route that lets Earth breathe."</Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Start" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Destination"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Transport"
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
            >
              {transportModes.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              type="number"
              fullWidth
              label="Distance (km)"
              value={form.distanceKm}
              onChange={(e) => setForm({ ...form, distanceKm: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button sx={{ height: "100%" }} fullWidth variant="contained" onClick={onCalculate}>
              Calculate
            </Button>
          </Grid>
        </Grid>

        {result && (
          <Stack spacing={1.2} sx={{ mt: 2 }}>
            <Typography>
              CO2 Emitted: <b>{result.emissionsKg} kg</b>
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip color="primary" label={`Route: ${form.start} -> ${form.destination}`} />
              <Chip color="secondary" label={`Distance: ${result.distanceKm} km`} />
            </Stack>
            <Typography variant="body2">
              Greener alternative: <b>{result.suggestion.mode}</b> saves {result.suggestion.reductionPct}% emissions.
            </Typography>
            <Box sx={{ p: 2, borderRadius: 3, background: "rgba(255,255,255,0.55)" }}>
              <Typography variant="body2" color="text.secondary">
                Formula used: {result.formula}
              </Typography>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
