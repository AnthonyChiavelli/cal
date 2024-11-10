import { create } from "zustand";

type StoreType = {
  confirmationModalVisible: boolean;
  confirmationModalMessage: string | null;
  confirmationModalPromiseResolve: null | ((value: any) => void);
  showConfirmationModal: (message: string) => void;
  hideConfirmationModal: () => void;
  setConfirmationPromiseResolve: (f: (accepted: boolean) => void) => void | null;
};

const useStore = create<StoreType>((set) => ({
  confirmationModalVisible: false,
  confirmationModalMessage: null,
  confirmationModalPromiseResolve: null,
  showConfirmationModal: (message: string) =>
    set({ confirmationModalVisible: true, confirmationModalMessage: message }),
  hideConfirmationModal: () => set({ confirmationModalVisible: false, confirmationModalMessage: null }),
  setConfirmationPromiseResolve: (resolveFunction) => set({ confirmationModalPromiseResolve: resolveFunction }),
}));

export { useStore };
