import { useRef, useState } from "react";

export function useAttemptThrottle({
  maxAttempts = 5,
  windowMs = 60_000,
  cooldownMs = 30_000,
}: {
  maxAttempts?: number;
  windowMs?: number;
  cooldownMs?: number;
} = {}) {
  const attemptsRef = useRef<number[]>([]);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);

  const isRateLimited = cooldownUntil !== null && Date.now() < cooldownUntil;

  const registerAttempt = () => {
    const now = Date.now();
    attemptsRef.current = attemptsRef.current.filter((t) => now - t < windowMs);
    attemptsRef.current.push(now);
    if (attemptsRef.current.length > maxAttempts) {
      setCooldownUntil(now + cooldownMs);
      return false;
    }
    return true;
  };

  const reset = () => {
    attemptsRef.current = [];
  };

  return { isRateLimited, registerAttempt, reset };
}
