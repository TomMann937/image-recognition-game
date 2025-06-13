import LeaderboardEntry from "../models/leaderboardEntry.model.js";
import mongoose from "mongoose";


export const getEntries = async (req, res) => {

  try {
    const entries = await LeaderboardEntry.find();
    res.status(200).json({ success: true, entries: entries})
  } catch (error) {
    console.log("Could not fetch products")
    res.status(500).json({ success: false, message: "Server Error"})
  }

}

export const createEntry = async (req, res) => {
  const leaderboardEntry = req.body;

  if(!leaderboardEntry.name || leaderboardEntry.score === undefined || leaderboardEntry.score === null ) {
    res.status(400).json({ success: false, message: 'Please provide all fields'});
  }

  const newLeaderboardEntry = new LeaderboardEntry(leaderboardEntry);

  try {
    newLeaderboardEntry.save();
    res.status(200).json({ success: true, data: newLeaderboardEntry});
  } catch (error) {
    console.error('Error in savling leaderboard entry', error.message);
    res.status(500).res.json({ success: false, message: 'Server Error'});
  }
}