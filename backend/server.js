import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { ConnectDB } from "./config/db.js";
import LeaderboardRoutes from "./routes/leaderboard.route.js";
import RecognitionRoutes from "./routes/recognition.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


app.use("/api/leaderboard", LeaderboardRoutes);

app.use("/api/recognition", RecognitionRoutes);

app.listen(PORT, () => {
  ConnectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
