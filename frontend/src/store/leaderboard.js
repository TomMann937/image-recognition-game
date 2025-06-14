import { create } from 'zustand';

export const useLeaderboardStore = create((set, get) => ({
  leaderboard: [],
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  fetchLeaderboard: async () => { 
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    set({ leaderboard: data.entries });
  }
}));