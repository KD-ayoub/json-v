import { set } from "lodash";
import { ReactNode } from "react";
import { create } from "zustand";

type Position = {
    x: number;
    y: number;
}

type State = {
    isModalOpen: boolean;
    modalContent: ReactNode;
    modalClosed: true | null
}

type Actions = {
    setIsModalOpen: (isOpen: boolean) => void,
    setModalContent: (mco: ReactNode) => void,
    setModalClosed: (cls: true | null) => void,
}

const useModal = create<State & Actions>((set) => ({
    isModalOpen: false,
    modalContent: null,
    modalClosed: null,
    setIsModalOpen: (isOpen) => {
        set({ isModalOpen: isOpen })
    },
    setModalContent: (mco) => {
        set({ modalContent: mco })
    },
    setModalClosed: (cls) => {
        set({ modalClosed: cls })
    },
}));

export default useModal;