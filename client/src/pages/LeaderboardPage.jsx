import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import { listLeaderboard } from "../api/client";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const rows = await listLeaderboard();
        setLeaders(rows);
      } catch (e) {
        setError(e?.response?.data?.message || "Unable to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(
    () => leaders.filter((u) => u.name?.toLowerCase().includes(query.toLowerCase().trim())),
    [leaders, query]
  );
  const podium = filtered.slice(0, 3);

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
                  "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <Typography variant="h5">Leaderboard</Typography>
              <Typography variant="body2">Go green. Gain points. Grab the crown.</Typography>
            </Box>
            <TextField
              sx={{ mt: 1.5 }}
              fullWidth
              label="Search eco champions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          {podium.map((u, i) => (
            <Grid item xs={12} md={4} key={u._id || `${u.name}-${i}`}>
              <Card sx={{ background: i === 0 ? "linear-gradient(130deg, rgba(249,168,37,0.25), rgba(255,255,255,0.8))" : "linear-gradient(130deg, rgba(2,136,209,0.18), rgba(255,255,255,0.8))" }}>
                <CardContent>
                  <Typography variant="overline">Rank #{i + 1}</Typography>
                  <Typography variant="h6">{u.name}</Typography>
                  <Chip sx={{ mt: 1 }} color="secondary" label={`Score ${u.sustainabilityScore || 0}`} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Full Rankings</Typography>
            {loading && <CircularProgress size={26} sx={{ mt: 1 }} />}
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            {!loading && !error && (
              <List dense>
                {filtered.map((u, idx) => (
                  <ListItem key={u._id || `${u.name}-${idx}`} sx={{ px: 0 }}>
                    <Box sx={{ width: "100%", p: 1.2, borderRadius: 2, background: "rgba(0,121,107,0.1)", display: "flex", justifyContent: "space-between" }}>
                      <Typography>{idx + 1}. {u.name}</Typography>
                      <Chip size="small" color="primary" label={`${u.sustainabilityScore || 0}`} />
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
            <Typography variant="caption">Catchphrase: "Rise green, lead clean."</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
