import { useRef, useState } from "react";

export function useHoverDropdown(closeDelayMs = 120) {
  const [active, setActive] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(label);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActive(null), closeDelayMs);
  };

  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(null);
  };

  return { active, open, scheduleClose, closeNow };
}
