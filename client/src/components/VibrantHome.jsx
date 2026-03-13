import { motion } from "framer-motion";
import { Box, Button, Card, CardContent, Grid, LinearProgress, Stack, Typography } from "@mui/material";

const imageCards = [
  {
    title: "Urban Cycling Culture",
    url: "https://images.unsplash.com/photo-1477512076069-d2ba046b4b0f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Community Tree Drive",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Clean Coast Volunteering",
    url: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function VibrantHome({ onLoginClick, onRegisterClick, showActions = false }) {
  return (
    <Stack spacing={2}>
      <Card
        sx={{
          overflow: "hidden",
          background:
            "linear-gradient(122deg, rgba(18,176,180,0.23), rgba(255,122,24,0.23)), url(https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <CardContent sx={{ py: { xs: 5, md: 8 }, px: { xs: 3, md: 5 }, color: "#fff" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Typography variant="h3">Live Better. Emit Less. Restore More.</Typography>
            <Typography sx={{ mt: 1.2, maxWidth: 620 }}>
              Duty of Life turns everyday choices into visible climate impact through carbon tracking, community challenges, offsets, and action-led stories.
            </Typography>
            {showActions && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={onLoginClick}>Login</Button>
                <Button variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.8)" }} onClick={onRegisterClick}>
                  Register
                </Button>
              </Stack>
            )}
          </motion.div>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {imageCards.map((item, index) => (
          <Grid item xs={12} md={4} key={item.title}>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <Card sx={{ height: 220, position: "relative", overflow: "hidden" }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.52), rgba(0,0,0,0.1)), url(${item.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                <CardContent sx={{ position: "relative", height: "100%", display: "flex", alignItems: "end", color: "#fff" }}>
                  <Typography variant="h6">{item.title}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Green Habit Momentum</Typography>
              <Typography variant="h4" color="primary">74%</Typography>
              <LinearProgress value={74} variant="determinate" sx={{ mt: 1, height: 10, borderRadius: 8 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Community CO2 Saved</Typography>
              <Typography variant="h4" color="secondary">1,248 kg</Typography>
              <Typography variant="body2">Collective impact this month across all members.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">CSR Programs Active</Typography>
              <Typography variant="h4" color="info.main">12</Typography>
              <Typography variant="body2">From campus drives to urban reforestation missions.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
