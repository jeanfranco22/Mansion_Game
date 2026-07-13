"use client";

import { useEffect, useState } from "react";

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const updateTouchState = () => setIsTouchDevice(query.matches);

    updateTouchState();
    query.addEventListener("change", updateTouchState);

    return () => query.removeEventListener("change", updateTouchState);
  }, []);

  return isTouchDevice;
}
