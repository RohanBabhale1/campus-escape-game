import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGameStore = create(
  persist(
    (set) => ({
      // ── Auth ─────────────────────────────────────────────────────────────────
      token: null,
      user: null,
      isLoggedIn: false,

      setAuth: (token, user) => set({ token, user, isLoggedIn: true }),
      logout: () =>
        set({
          token: null,
          user: null,
          isLoggedIn: false,
          sessionId: null,
          rooms: [],
          inventory: [],
          currentRoom: null,
          activeScene: "lobby",
          activePuzzle: null,
          puzzleStates: {},
          sessionScore: 0,
          gameCompleted: false,
          playerPosition: { x: 0, y: 2, z: 8 },
        }),

      // ── Session ──────────────────────────────────────────────────────────────
      sessionId: null,
      sessionScore: 0,
      setSession: (sessionId) => set({ sessionId }),
      addScore: (pts) => set((s) => ({ sessionScore: s.sessionScore + pts })),

      // ── Rooms ─────────────────────────────────────────────────────────────────
      rooms: [],
      setRooms: (rooms) => set({ rooms }),
      updateRoom: (slug, update) =>
        set((s) => ({
          rooms: s.rooms.map((r) =>
            r.slug === slug ? { ...r, ...update } : r,
          ),
        })),

      // ── Inventory ─────────────────────────────────────────────────────────────
      inventory: [],
      addKey: (roomSlug) =>
        set((s) => ({
          inventory: s.inventory.includes(roomSlug)
            ? s.inventory
            : [...s.inventory, roomSlug],
        })),

      // ── Scene ─────────────────────────────────────────────────────────────────
      activeScene: "lobby",
      currentRoom: null,
      setActiveScene: (scene) => set({ activeScene: scene }),
      enterRoom: (room) =>
        set({ currentRoom: room, activeScene: `room:${room.slug}` }),

      // FIX: also clear activePuzzle when exiting a room.
      // Previously the puzzle overlay stayed visible after pressing Q, making the
      // game appear frozen until reload.
      exitRoom: () =>
        set({ currentRoom: null, activeScene: "lobby", activePuzzle: null }),

      // ── Puzzle ────────────────────────────────────────────────────────────────
      activePuzzle: null,
      puzzleStates: {},
      openPuzzle: (puzzleId) => set({ activePuzzle: puzzleId }),
      closePuzzle: () => set({ activePuzzle: null }),
      solvePuzzle: (roomSlug, puzzleId) =>
        set((s) => ({
          puzzleStates: {
            ...s.puzzleStates,
            [roomSlug]: {
              ...(s.puzzleStates[roomSlug] || {}),
              [puzzleId]: true,
            },
          },
        })),

      // ── Player world position (for door/puzzle proximity without camera offset) ─
      playerPosition: { x: 0, y: 2, z: 8 },
      setPlayerPosition: (pos) => set({ playerPosition: pos }),

      // ── Interaction prompt ────────────────────────────────────────────────────
      interactionTarget: null,
      setInteractionTarget: (target) => set({ interactionTarget: target }),

      // ── UI flags ──────────────────────────────────────────────────────────────
      isPaused: false,
      gameCompleted: false,
      setPaused: (v) => set({ isPaused: v }),
      setGameCompleted: (v) => set({ gameCompleted: v }),
    }),
    {
      name: "escape-room-game-state",
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        isLoggedIn: s.isLoggedIn,
        sessionId: s.sessionId,
        inventory: s.inventory,
        puzzleStates: s.puzzleStates,
        // Do NOT persist playerPosition — always reset to spawn on load
        // Do NOT persist activePuzzle  — never restore a mid-puzzle state
      }),
    },
  ),
);

export default useGameStore;
