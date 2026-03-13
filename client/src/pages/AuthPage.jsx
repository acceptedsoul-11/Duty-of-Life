import { useState } from "react";
import { Alert, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { authStore, login, register } from "../api/client";

export default function AuthPage({ onAuthenticated, onBack, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const action = mode === "register" ? register : login;
      const payload = mode === "register" ? form : { email: form.email, password: form.password };
      const res = await action(payload);
      authStore.setSession(res.token, res.user);
      onAuthenticated(res.user);
    } catch (e) {
      setError(e?.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 760,
        mx: "auto",
        mt: 8,
        background: "linear-gradient(126deg, #E3F2FD 0%, #FFF3E0 100%)"
      }}
    >
      <CardContent>
        <Typography variant="h4">Duty of Life</Typography>
        <Typography color="text.secondary">Sign in to track, compete, and offset carbon impact.</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {mode === "register" && (
            <Grid item xs={12}>
              <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Grid>
          {mode === "register" && (
            <Grid item xs={12}>
              <TextField select fullWidth label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </TextField>
            </Grid>
          )}
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
          <Button variant="contained" onClick={submit}>
            {mode === "register" ? "Create Account" : "Login"}
          </Button>
          <Button variant="outlined" onClick={() => setMode(mode === "register" ? "login" : "register")}>
            {mode === "register" ? "Have account? Login" : "Need account? Register"}
          </Button>
          {onBack && (
            <Button variant="text" onClick={onBack}>
              Back to Home
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
