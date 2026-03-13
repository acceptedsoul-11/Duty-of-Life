import { Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";

export default function ScorePanel({ scoreData }) {
  if (!scoreData) return null;
  return (
    <Card sx={{ background: "linear-gradient(135deg, rgba(31,107,59,0.16), rgba(93,173,226,0.16))" }}>
      <CardContent>
        <Typography variant="h5">Smart Sustainability Score</Typography>
        <Typography variant="h3" color="primary" sx={{ mt: 1 }}>
          {scoreData.score}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(100, scoreData.score)}
          sx={{ mt: 2, height: 12, borderRadius: 999 }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
          {scoreData.badges.map((b) => (
            <Chip key={b} label={b} color="success" variant="outlined" />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
