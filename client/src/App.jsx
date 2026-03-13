import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { AppBar, Box, Button, CircularProgress, Container, Grid, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { authStore, fetchAnalytics, fetchScore, me } from "./api/client";

const AnalyticsCharts = lazy(() => import("./components/AnalyticsCharts"));
const ScorePanel = lazy(() => import("./components/ScorePanel"));
const VibrantHome = lazy(() => import("./components/VibrantHome"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Advisor = lazy(() => import("./pages/Advisor"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const CommuteTracker = lazy(() => import("./pages/CommuteTracker"));
const CSRChallenges = lazy(() => import("./pages/CSRChallenges"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const SocialNetwork = lazy(() => import("./pages/SocialNetwork"));
const TreeOffset = lazy(() => import("./pages/TreeOffset"));

function LoadingPane() {
  return (
    <Box sx={{ minHeight: 220, display: "grid", placeItems: "center" }}>
      <CircularProgress size={32} />
    </Box>
  );
}

const appSubtitle = "Small actions. Lighter footprints. Bigger change.";

export default function App() {
  const [tab, setTab] = useState(0);
  const [currentUser, setCurrentUser] = useState(authStore.getUser());
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [scoreData, setScoreData] = useState(null);
  const [analytics, setAnalytics] = useState({ line: [], pie: [] });
  const [isReady, setIsReady] = useState(false);

  const background = useMemo(
    () =>
      "radial-gradient(circle at 0% 0%, rgba(78,159,61,0.35), transparent 32%), radial-gradient(circle at 100% 20%, rgba(93,173,226,0.25), transparent 35%), linear-gradient(140deg, #eef6ef 0%, #f4eee7 100%)",
    []
  );

  const tabDefs = useMemo(() => {
    const base = ["Home", "Insights", "Commute", "Advisor", "Tree Offset", "CSR", "Leaderboard", "Blogs", "Social"];
    if (currentUser?.role === "ADMIN") base.push("Admin");
    return base;
  }, [currentUser?.role]);

  const bootstrapUser = async () => {
    if (!authStore.hasToken()) {
      setIsReady(true);
      return;
    }
    try {
      const profile = await me();
      setCurrentUser({
        id: profile._id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        badges: profile.badges
      });
    } catch {
      authStore.clear();
      setCurrentUser(null);
    } finally {
      setIsReady(true);
    }
  };

  const loadSummary = async () => {
    if (!authStore.hasToken()) return;
    const [scoreRes, analyticsRes] = await Promise.all([fetchScore(), fetchAnalytics()]);
    setScoreData(scoreRes);
    setAnalytics(analyticsRes);
  };

  useEffect(() => {
    bootstrapUser();
  }, []);

  useEffect(() => {
    if (currentUser) loadSummary();
  }, [currentUser, tab]);

  const onLogout = () => {
    authStore.clear();
    setCurrentUser(null);
    setShowAuth(false);
    setTab(0);
    setScoreData(null);
    setAnalytics({ line: [], pie: [] });
  };

  if (!isReady) return null;
  if (!currentUser) {
    return (
      <Box sx={{ minHeight: "100vh", background, pb: 6 }}>
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <Toolbar>
            <Typography variant="h4">Duty of Life</Typography>
            <Typography sx={{ ml: 2, color: "text.secondary" }}>{appSubtitle}</Typography>
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <Button variant="contained" color="secondary" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>
                Login
              </Button>
              <Button variant="outlined" onClick={() => { setAuthMode("register"); setShowAuth(true); }}>
                Register
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 3 }}>
          {!showAuth && (
            <Suspense fallback={<LoadingPane />}>
              <VibrantHome
                showActions
                onLoginClick={() => { setAuthMode("login"); setShowAuth(true); }}
                onRegisterClick={() => { setAuthMode("register"); setShowAuth(true); }}
              />
            </Suspense>
          )}
          {showAuth && (
            <Suspense fallback={<LoadingPane />}>
              <AuthPage
                initialMode={authMode}
                onAuthenticated={setCurrentUser}
                onBack={() => setShowAuth(false)}
              />
            </Suspense>
          )}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background, pb: 6 }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <Toolbar>
          <Typography variant="h4">Duty of Life</Typography>
          <Typography sx={{ ml: 2, color: "text.secondary" }}>{appSubtitle}</Typography>
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">{currentUser.name} ({currentUser.role})</Typography>
            <Button size="small" variant="outlined" onClick={onLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
          {tabDefs.map((t) => (
            <Tab key={t} label={t} />
          ))}
        </Tabs>

        <motion.div key={tab} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
          {tab === 0 && (
            <Suspense fallback={<LoadingPane />}>
              <VibrantHome />
            </Suspense>
          )}
          {tab === 1 && (
            <Suspense fallback={<LoadingPane />}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      color: "#fff",
                      backgroundImage:
                        "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80)",
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  >
                    <Typography variant="h5">Impact Insights</Typography>
                    <Typography variant="body2">Track your score, habits, and progress trends in one view.</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <ScorePanel scoreData={scoreData} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <AnalyticsCharts lineData={analytics.line} pieData={analytics.pie} />
                </Grid>
              </Grid>
            </Suspense>
          )}
          {tab === 2 && <Suspense fallback={<LoadingPane />}><CommuteTracker /></Suspense>}
          {tab === 3 && <Suspense fallback={<LoadingPane />}><Advisor /></Suspense>}
          {tab === 4 && <Suspense fallback={<LoadingPane />}><TreeOffset /></Suspense>}
          {tab === 5 && <Suspense fallback={<LoadingPane />}><CSRChallenges currentUser={currentUser} /></Suspense>}
          {tab === 6 && <Suspense fallback={<LoadingPane />}><LeaderboardPage /></Suspense>}
          {tab === 7 && <Suspense fallback={<LoadingPane />}><BlogsPage /></Suspense>}
          {tab === 8 && <Suspense fallback={<LoadingPane />}><SocialNetwork /></Suspense>}
          {tab === 9 && currentUser.role === "ADMIN" && <Suspense fallback={<LoadingPane />}><AdminPanel /></Suspense>}
        </motion.div>
      </Container>
    </Box>
  );
}
