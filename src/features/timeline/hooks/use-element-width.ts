"use client";

import { useEffect, useState, type RefObject } from "react";

/** Track the width of an element in real time (in pixels) via ResizeObserver. */
export const useElementWidth = (ref: RefObject<HTMLElement | null>): number => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof ResizeObserver === "undefined") {
      setWidth(node.getBoundingClientRect().width);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    setWidth(node.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [ref]);

  return width;
};
