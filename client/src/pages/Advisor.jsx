import { useState } from "react";
import { Box, Button, Card, CardContent, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import { getAdvice } from "../api/client";

export default function Advisor() {
  const [form, setForm] = useState({ travelKmPerDay: 20, electricityKwh: 8, meatMealsPerDay: 2 });
  const [advice, setAdvice] = useState(null);

  const runAdvisor = async () => {
    const result = await getAdvice(form);
    setAdvice(result);
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
              "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mb: 2
          }}
        >
          <Typography variant="h5">Sustainability Advisor</Typography>
          <Typography variant="body2">Analyze lifestyle habits and get practical low-carbon recommendations.</Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Car travel km/day"
              value={form.travelKmPerDay}
              onChange={(e) => setForm({ ...form, travelKmPerDay: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Electricity (kWh)"
              value={form.electricityKwh}
              onChange={(e) => setForm({ ...form, electricityKwh: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Meat meals/day"
              value={form.meatMealsPerDay}
              onChange={(e) => setForm({ ...form, meatMealsPerDay: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button sx={{ height: "100%" }} fullWidth variant="contained" onClick={runAdvisor}>
              Get Advice
            </Button>
          </Grid>
        </Grid>
        {advice && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Eco Tips</Typography>
            <List dense>
              {advice.eco_tips.map((tip) => (
                <ListItem key={tip}>- {tip}</ListItem>
              ))}
            </List>
            <Typography variant="body2">Estimated CO2 savings: {advice.estimated_CO2_savings} kg/day</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
