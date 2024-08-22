import { create } from "zustand";

type State = {
    choice: boolean;
}

type Actions = {
    setChoice: (choice: boolean) => void
}

const useChoice = create<State & Actions>((set) => ({
    choice: false,
    setChoice: (choice: boolean) => {
        set({ choice: choice })
    },
}))

export default useChoice;