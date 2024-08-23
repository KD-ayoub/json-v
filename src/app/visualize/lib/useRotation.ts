import { create } from "zustand";

export type Direction = "RIGHT" | "LEFT" | "DOWN" | "UP";



type State = {
    direction: Direction;
    degree: number
}

type Actions = {
    setDirection: (direction: Direction) => void
}

const useRotation = create<State & Actions>((set, get) => ({
    direction: "RIGHT",
    degree: 270,
    setDirection: (direction: Direction) => {
        console.log("seted", direction)
        const before = get().degree;
        set({ direction: direction, degree:  (before + 90) % 360})
    },
}));

export default useRotation;