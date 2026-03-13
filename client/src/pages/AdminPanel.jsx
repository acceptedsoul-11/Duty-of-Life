import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Grid, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { closeChallenge, dispatchReward, listChallenges, listPendingSubmissions, listRewards, verifySubmission } from "../api/client";

export default function AdminPanel() {
  const [pending, setPending] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [scoreById, setScoreById] = useState({});
  const [trackingById, setTrackingById] = useState({});
  const [statusMsg, setStatusMsg] = useState("");

  const load = async () => {
    const [submissions, rewardRows, challengeRows] = await Promise.all([listPendingSubmissions(), listRewards(), listChallenges()]);
    setPending(submissions);
    setRewards(rewardRows);
    setChallenges(challengeRows);
  };

  useEffect(() => {
    load();
  }, []);

  const onVerify = async (id) => {
    setStatusMsg("");
    await verifySubmission(id, Number(scoreById[id] || 0));
    load();
    setStatusMsg("Submission verified.");
  };

  const onDispatch = async (id) => {
    setStatusMsg("");
    await dispatchReward(id, {
      dispatchStatus: "DISPATCHED",
      trackingNumber: trackingById[id] || `TRK-${Date.now()}`,
      deliveryDate: new Date(Date.now() + 5 * 86400000)
    });
    load();
    setStatusMsg("Reward dispatched.");
  };

  const onCloseChallenge = async (challengeId) => {
    setStatusMsg("");
    await closeChallenge(challengeId);
    load();
    setStatusMsg("Challenge closed and winners processed.");
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
                  "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <Typography variant="h5">CSR Admin Console</Typography>
              <Typography variant="body2">Manage contests, verify participant proof, and dispatch rewards with tracking.</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Close Challenge & Generate Winners</Typography>
            {statusMsg && <Alert sx={{ mt: 1 }} severity="success">{statusMsg}</Alert>}
            <List>
              {challenges.filter((c) => c.status === "OPEN").map((c) => (
                <ListItem key={c._id} sx={{ px: 0 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, width: "100%", background: "rgba(2,136,209,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography fontWeight={700}>{c.title}</Typography>
                      <Typography variant="body2">{c.description}</Typography>
                    </Box>
                    <Button variant="contained" onClick={() => onCloseChallenge(c._id)}>Close</Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">Verify Submissions</Typography>
            <List>
              {pending.map((s) => (
                <ListItem key={s._id} sx={{ px: 0, display: "block" }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, background: "rgba(31,107,59,0.08)" }}>
                    <Typography fontWeight={700}>{s.challengeId?.title}</Typography>
                    <Typography variant="body2">{s.userId?.name} - {s.userId?.email}</Typography>
                    <Typography variant="body2">Proof: {s.proofUrl || "N/A"}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        label="Score"
                        value={scoreById[s._id] || ""}
                        onChange={(e) => setScoreById({ ...scoreById, [s._id]: e.target.value })}
                      />
                      <Button variant="contained" onClick={() => onVerify(s._id)}>
                        Verify
                      </Button>
                    </Stack>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">Reward Dispatch</Typography>
            <List>
              {rewards.map((r) => (
                <ListItem key={r._id} sx={{ px: 0, display: "block" }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, background: "rgba(122,82,48,0.1)" }}>
                    <Typography fontWeight={700}>{r.rewardId}</Typography>
                    <Typography variant="body2">Winner: {r.winnerId?.name}</Typography>
                    <Typography variant="body2">Status: {r.dispatchStatus}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <TextField
                        size="small"
                        label="Tracking"
                        value={trackingById[r._id] || ""}
                        onChange={(e) => setTrackingById({ ...trackingById, [r._id]: e.target.value })}
                      />
                      <Button variant="outlined" onClick={() => onDispatch(r._id)} disabled={r.dispatchStatus === "DELIVERED"}>
                        Dispatch
                      </Button>
                    </Stack>
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
