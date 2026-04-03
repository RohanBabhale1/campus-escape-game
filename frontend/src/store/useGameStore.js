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
        
      completeRoomFrontend: (slug) =>
        set((s) => {
          const currentIndex = s.rooms.findIndex((r) => r.slug === slug);
          if (currentIndex === -1) return s;
          
          const newRooms = [...s.rooms];
          newRooms[currentIndex] = { ...newRooms[currentIndex], is_completed: true, key_collected: true };
          
          let newGameCompleted = s.gameCompleted;

          // Unlock the strictly next room in visual sequence
          if (currentIndex + 1 < newRooms.length && newRooms[currentIndex + 1].slug !== "final") {
            newRooms[currentIndex + 1] = { ...newRooms[currentIndex + 1], is_unlocked: true };
          } else if (currentIndex + 1 < newRooms.length && newRooms[currentIndex + 1].slug === "final") {
             // Unlock final escape room if this was the last puzzle
            const totalDone = newRooms.filter(r => r.is_completed && r.slug !== "final").length;
            if (totalDone >= 8) {
               newRooms[currentIndex + 1] = { ...newRooms[currentIndex + 1], is_unlocked: true };
               // Fire victory exactly here before returning
               if (!s.gameCompleted) newGameCompleted = true;
            }
          }
          return { rooms: newRooms, gameCompleted: newGameCompleted };
        }),

      // ── Inventory ─────────────────────────────────────────────────────────────
      inventory: [],
      addKey: (roomSlug) =>
        set((s) => ({
          inventory: s.inventory.includes(roomSlug)
            ? s.inventory
            : [...s.inventory, roomSlug],
        })),
      updateInventory: (inv) => set({ inventory: inv }),

      // ── Scene ─────────────────────────────────────────────────────────────────
      activeScene: "lobby",
      currentRoom: null,
      setActiveScene: (scene) => set({ activeScene: scene }),
      enterRoom: (room) =>
        set({ currentRoom: room, activeScene: `room:${room.slug}` }),

      // FIX: also clear activePuzzle when exiting a room.
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
      resetPuzzleStates: () => set({ puzzleStates: {} }),

      // ── Player world position (for door/puzzle proximity without camera offset) ─
      playerPosition: { x: 0, y: 2, z: 8 },
      setPlayerPosition: (pos) => set({ playerPosition: pos }),

      // ── Interaction prompt ────────────────────────────────────────────────────
      interactionTarget: null,
      setInteractionTarget: (target) => set({ interactionTarget: target }),

      // ── UI flags ──────────────────────────────────────────────────────────────
      isPaused: false,
      gameCompleted: false,
      canInteract: false,
      spawnNode: 'default',
      setPaused: (v) => set({ isPaused: v }),
      setGameCompleted: (v) => set({ gameCompleted: v }),
      setCanInteract: (v) => set({ canInteract: v }),
      setSpawnNode: (v) => set({ spawnNode: v }),
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
