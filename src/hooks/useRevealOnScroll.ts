"use client";

import { useCallback, useEffect, useState } from "react";

export function useRevealOnScroll<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [visible, setVisible] = useState(false);

  const ref = useCallback((el: T | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node]);

  return { ref, visible };
}
