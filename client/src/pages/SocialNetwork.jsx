import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Grid, List, ListItem, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { createPost, listFeed } from "../api/client";

const factors = { car: 0.12, bus: 0.07, train: 0.04, bicycle: 0, walking: 0, flight: 0.255 };

export default function SocialNetwork() {
  const [content, setContent] = useState("");
  const [impactKg, setImpactKg] = useState("");
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState("");
  const [calc, setCalc] = useState({ distanceKm: 10, mode: "car" });

  const calcResult = useMemo(() => {
    const emission = Number((Number(calc.distanceKm || 0) * factors[calc.mode]).toFixed(2));
    return emission;
  }, [calc]);

  const loadData = async () => {
    setError("");
    try {
      const feedRows = await listFeed();
      setFeed(feedRows);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load community feed.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onPost = async () => {
    if (!content.trim()) return;
    await createPost({ content, impactKg });
    setContent("");
    setImpactKg("");
    loadData();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                color: "#fff",
                backgroundImage:
                  "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <Typography variant="h5">Social Sustainability Hub</Typography>
              <Typography variant="body2">Post it. Boost it. Beat yesterday.</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Share Your Eco Win</Typography>
            <Typography variant="body2" color="text.secondary">Make it public and spark one more person to act green today.</Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mt: 1 }}>
              <TextField fullWidth label="Share milestone" value={content} onChange={(e) => setContent(e.target.value)} />
              <TextField type="number" label="Impact kg" value={impactKg} onChange={(e) => setImpactKg(Number(e.target.value))} />
              <Button variant="contained" onClick={onPost}>Post</Button>
            </Stack>
            <Typography sx={{ mt: 1 }} variant="caption">Catchphrase: "One post. One spark. One greener city."</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Quick Carbon Footprint Calculator</Typography>
            <Typography variant="body2" color="text.secondary">Calculate before you travel: smart choices start with numbers.</Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mt: 1 }}>
              <TextField
                type="number"
                label="Distance (km)"
                value={calc.distanceKm}
                onChange={(e) => setCalc({ ...calc, distanceKm: e.target.value })}
              />
              <TextField select label="Transport" value={calc.mode} onChange={(e) => setCalc({ ...calc, mode: e.target.value })}>
                {Object.keys(factors).map((mode) => (
                  <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="h6" color="primary">{calcResult} kg CO2</Typography>
              <Typography variant="caption">Slogan: "Count carbon, cut carbon, conquer carbon."</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Community Feed</Typography>
            <Typography variant="body2" color="text.secondary">See what others are doing and replicate one action today.</Typography>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            <List>
              {feed.map((post) => (
                <ListItem key={post._id} sx={{ px: 0 }}>
                  <Box sx={{ width: "100%", p: 1.5, borderRadius: 2, background: "rgba(122,82,48,0.1)" }}>
                    <Typography fontWeight={700}>{post.userId?.name || "Eco User"}</Typography>
                    <Typography>{post.content}</Typography>
                    <Typography variant="caption">Impact: {post.impactKg} kg CO2</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
