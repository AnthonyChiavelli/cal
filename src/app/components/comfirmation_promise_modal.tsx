"use client";

import { useCallback } from "react";
import ConfirmationModal from "@/app/components/confirmation_modal";
import { useStore } from "@/app/store";

export default function ConfirmationPromiseModal() {
  const store = useStore();

  const handleAccept = useCallback(() => {
    store.hideConfirmationModal();
    // @ts-ignore zustand seems to take provided store type and use a non-nullable version
    store.confirmationModalPromiseResolve !== null && store.confirmationModalPromiseResolve(true);
  }, [store]);

  const handleReject = useCallback(() => {
    store.hideConfirmationModal();
    // @ts-ignore zustand seems to take provided store type and use a non-nullable version
    store.confirmationModalPromiseResolve !== null && store.confirmationModalPromiseResolve(false);
  }, [store]);

  return (
    <ConfirmationModal
      open={store.confirmationModalVisible}
      message={store.confirmationModalMessage || "Are you sure?"}
      onAccept={handleAccept}
      onDeny={handleReject}
    />
  );
}

export function promptModal(message: string) {
  const store = useStore.getState();
  store.showConfirmationModal(message);

  // @ts-ignore
  const { promise, resolve } = Promise.withResolvers();
  store.setConfirmationPromiseResolve(resolve);

  return promise;
}
