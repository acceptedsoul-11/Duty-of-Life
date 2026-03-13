import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import { createChallenge, listChallenges, submitChallenge } from "../api/client";

export default function CSRChallenges({ currentUser }) {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    title: "Campus Green Drive",
    description: "Plant and maintain 20 trees",
    category: "Tree Plantation",
    location: "City Campus",
    csrPartner: "Green NGO",
    rewardDetails: "Top 3 get eco kits + certificates",
    proofRequirements: "Upload photo + activity log link",
    rules: "No duplicate entries. Team of max 4.",
    maxParticipants: 150,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  });
  const [proofUrlById, setProofUrlById] = useState({});

  const load = async () => {
    const data = await listChallenges();
    setChallenges(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    await createChallenge({
      ...newChallenge,
      startDate: new Date(newChallenge.startDate),
      endDate: new Date(newChallenge.endDate),
      maxParticipants: Number(newChallenge.maxParticipants || 0)
    });
    setNewChallenge({
      title: "",
      description: "",
      category: "",
      location: "",
      csrPartner: "",
      rewardDetails: "",
      proofRequirements: "",
      rules: "",
      maxParticipants: 0,
      startDate: "",
      endDate: ""
    });
    load();
  };

  const onSubmit = async (challengeId) => {
    await submitChallenge(challengeId, { proofUrl: proofUrlById[challengeId] || "", score: 75 });
    setProofUrlById((prev) => ({ ...prev, [challengeId]: "" }));
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
              "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <Typography variant="h5">CSR Challenges & Rewards</Typography>
          <Typography variant="body2">Launch detailed sustainability contests and collect verified impact proofs.</Typography>
          <Typography variant="caption">Catchphrase: "Challenge today, restore tomorrow."</Typography>
        </Box>
        {currentUser?.role === "ADMIN" && (
          <Typography sx={{ mt: 2 }} variant="subtitle1">Create New Contest</Typography>
        )}
        {currentUser?.role === "ADMIN" && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Challenge title" value={newChallenge.title} onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Description"
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Category" value={newChallenge.category} onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Location" value={newChallenge.location} onChange={(e) => setNewChallenge({ ...newChallenge, location: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="CSR Partner" value={newChallenge.csrPartner} onChange={(e) => setNewChallenge({ ...newChallenge, csrPartner: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth type="number" label="Max Participants" value={newChallenge.maxParticipants} onChange={(e) => setNewChallenge({ ...newChallenge, maxParticipants: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} value={newChallenge.startDate} onChange={(e) => setNewChallenge({ ...newChallenge, startDate: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} value={newChallenge.endDate} onChange={(e) => setNewChallenge({ ...newChallenge, endDate: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Proof Requirements" value={newChallenge.proofRequirements} onChange={(e) => setNewChallenge({ ...newChallenge, proofRequirements: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Reward Details" value={newChallenge.rewardDetails} onChange={(e) => setNewChallenge({ ...newChallenge, rewardDetails: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField fullWidth label="Rules" value={newChallenge.rules} onChange={(e) => setNewChallenge({ ...newChallenge, rules: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button fullWidth variant="contained" sx={{ height: "100%" }} onClick={onCreate}>
                Create Challenge
              </Button>
            </Grid>
          </Grid>
        )}
        <List>
          {challenges.map((challenge) => (
            <ListItem key={challenge._id} sx={{ display: "block", px: 0 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, background: "rgba(31,107,59,0.08)" }}>
                <Typography fontWeight={700}>{challenge.title}</Typography>
                <Typography variant="body2">{challenge.description}</Typography>
                <Typography variant="caption" display="block">Category: {challenge.category || "N/A"} | Location: {challenge.location || "N/A"}</Typography>
                <Typography variant="caption" display="block">Partner: {challenge.csrPartner || "N/A"} | Status: {challenge.status}</Typography>
                <Typography variant="caption" display="block">Rewards: {challenge.rewardDetails || "N/A"}</Typography>
                <Typography variant="caption" display="block">Proof: {challenge.proofRequirements || "N/A"}</Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Proof URL"
                      size="small"
                      value={proofUrlById[challenge._id] || ""}
                      onChange={(e) => setProofUrlById((prev) => ({ ...prev, [challenge._id]: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button fullWidth variant="outlined" onClick={() => onSubmit(challenge._id)}>
                      Submit Proof
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
