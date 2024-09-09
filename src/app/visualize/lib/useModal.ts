import { set } from "lodash";
import { create } from "zustand";

type Position = {
    x: number;
    y: number;
}

type State = {
    isModalOpen: boolean;
    previousPosition: Position
}

type Actions = {
    setIsModalOpen: (isOpen: boolean) => void,
    setPrevPosition: (prev: Position) => void
}

const useModal = create<State & Actions>((set) => ({
    isModalOpen: false,
    previousPosition: { x: 0, y: 0 },
    setIsModalOpen: (isOpen) => {
        set({ isModalOpen: isOpen })
    },
    setPrevPosition: (prev) => {
        set({ previousPosition: prev })
    }
}));

export default useModal;