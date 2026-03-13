import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#1F6B3B", "#7A5230", "#5DADE2", "#4E9F3D", "#BACD92"];

export default function AnalyticsCharts({ lineData = [], pieData = [] }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6">Weekly Emissions Trend</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="eco" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F6B3B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1F6B3B" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="emissions" stroke="#1F6B3B" fillOpacity={1} fill="url(#eco)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6">Transport Emission Breakdown</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="emissions" nameKey="mode" outerRadius={90} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
