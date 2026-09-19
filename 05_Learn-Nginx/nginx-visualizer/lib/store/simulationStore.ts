import { create } from "zustand";
import { SimulationStep } from "../simulator/SimulationEngine";

interface SimulationStore {
    history: SimulationStep[];
    currentStepIndex: number;
    isPlaying: boolean;
    speedMs: number;
    currentStep: () => SimulationStep | undefined;
    loadSimulation: (steps: SimulationStep[]) => void;
    setCurrentStepIndex: (index: number) => void;
    stepForward: () => void;
    stepBack: () => void;
    play: () => void;
    pause: () => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
    history: [],
    currentStepIndex: -1,
    isPlaying: false,
    speedMs: 900,
    currentStep: () => get().history[get().currentStepIndex],
    loadSimulation: (steps) => set({ history: steps, currentStepIndex: steps.length > 0 ? 0 : -1, isPlaying: false }),
    setCurrentStepIndex: (index) => set((s) => ({ currentStepIndex: Math.max(-1, Math.min(index, s.history.length - 1)) })),
    stepForward: () => set((s) => ({ currentStepIndex: Math.min(s.currentStepIndex + 1, s.history.length - 1) })),
    stepBack: () => set((s) => ({ currentStepIndex: Math.max(s.currentStepIndex - 1, 0) })),
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
}));
