import { useEffect, useState } from "react";

export function useScrollShadow(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handScroll = () => setScrolled(window.scrollY > threshold);
    handScroll();

    window.addEventListener("scroll", handScroll);

    return () => window.removeEventListener("scroll", handScroll);
  }, [threshold]);

  return scrolled
}
