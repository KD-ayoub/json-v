import { set } from "lodash";
import { ReactNode } from "react";
import { create } from "zustand";


type State = {
    title: string
    isModalOpen: boolean;
    modalContent: ReactNode;
    modalClosed: true | null
}

type Actions = {
    setModalTitle: (title: string) => void,
    setIsModalOpen: (isOpen: boolean) => void,
    setModalContent: (mco: ReactNode) => void,
    setModalClosed: (cls: true | null) => void,
}

const useModal = create<State & Actions>((set) => ({
    isModalOpen: false,
    modalContent: null,
    modalClosed: null,
    title: "",
    setModalTitle: (title) => {
        set({ title: title });
    },
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