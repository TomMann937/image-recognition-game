import express from "express";

import { getEntries, createEntry } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/", getEntries);
router.post("/", createEntry);

export default router;
