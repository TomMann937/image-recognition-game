import { create } from 'zustand';

export const useLeaderboardStore = create((set, get) => ({
  leaderboard: [],
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  fetchLeaderboard: async () => { 
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    set({ leaderboard: data.entries });
  },
  createLeaderboardEntry: async (leaderboardEntry) => {
    if(!leaderboardEntry.name || (leaderboardEntry.score === null) ){
      return { success: false, message: "Please fill in all fields"};
    }
    const res = await fetch("/api/leaderboard",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaderboardEntry)
    });
    const data = await res.json();
    // set((state) => ({ leaderboard: [...state.leaderboard, data.data]}));
    return { success: true, message: "Leaderboard updated successfully"};

  }

}));