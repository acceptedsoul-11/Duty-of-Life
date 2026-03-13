import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Grid, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { createBlog, listBlogs } from "../api/client";

const starterCover = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    summary: "",
    coverImage: "",
    tags: "",
    content: ""
  });

  const loadBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await listBlogs();
      setBlogs(rows);
      if (!selectedId && rows.length) setSelectedId(rows[0]._id);
    } catch (e) {
      setError(e?.response?.data?.message || "Unable to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const selected = useMemo(() => blogs.find((b) => b._id === selectedId) || blogs[0] || null, [blogs, selectedId]);

  const publish = async () => {
    setError("");
    try {
      const created = await createBlog({
        title: form.title,
        summary: form.summary,
        coverImage: form.coverImage || starterCover,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        content: form.content
      });
      setBlogs((prev) => [created, ...prev]);
      setSelectedId(created._id);
      setForm({ title: "", summary: "", coverImage: "", tags: "", content: "" });
    } catch (e) {
      setError(e?.response?.data?.message || "Unable to publish blog");
    }
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
                  "linear-gradient(125deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12)), url(https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <Typography variant="h5">Community Green Blogs</Typography>
              <Typography variant="body2">Write bold. Read deep. Inspire change.</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6">Write a Blog</Typography>
            <Typography variant="body2" color="text.secondary">Turn eco experience into action-ready stories.</Typography>
            <Stack spacing={1.2} sx={{ mt: 1 }}>
              <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <TextField label="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              <TextField label="Cover image URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
              <TextField label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              <TextField
                label="Content"
                multiline
                minRows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <Button variant="contained" onClick={publish}>Publish Blog</Button>
            </Stack>
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              Catchphrase: "Your words can plant a thousand habits."
            </Typography>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6">Read Blogs</Typography>
            {loading && <Typography variant="body2">Loading blogs...</Typography>}
            {!loading && blogs.length === 0 && (
              <Alert severity="info" sx={{ mt: 1 }}>No blogs yet. Be the first to publish one.</Alert>
            )}
            {blogs.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={4}>
                  <List dense sx={{ maxHeight: 420, overflow: "auto", pr: 0.5 }}>
                    {blogs.map((blog) => (
                      <ListItem key={blog._id} sx={{ px: 0 }}>
                        <Button
                          fullWidth
                          variant={selected?._id === blog._id ? "contained" : "outlined"}
                          onClick={() => setSelectedId(blog._id)}
                          sx={{ justifyContent: "flex-start", textTransform: "none" }}
                        >
                          {blog.title}
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={8}>
                  {selected && (
                    <Box>
                      <Box
                        sx={{
                          height: 180,
                          borderRadius: 2,
                          backgroundImage: `url(${selected.coverImage || starterCover})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }}
                      />
                      <Typography variant="h6" sx={{ mt: 1 }}>{selected.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        by {selected.authorId?.name || "Community Author"} | {new Date(selected.createdAt).toLocaleDateString()}
                      </Typography>
                      {selected.summary && <Typography sx={{ mt: 1 }}><b>{selected.summary}</b></Typography>}
                      <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{selected.content}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                        {(selected.tags || []).map((tag) => (
                          <Chip key={`${selected._id}-${tag}`} size="small" label={tag} color="secondary" variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
