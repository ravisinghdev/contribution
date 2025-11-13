"use client";

import React from "react";

export function AnimatedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  // We apply the gradient, but also a dark overlay so the text on top is readable.
  return (
    <div className="animated-gradient">
      <div className="w-full h-full bg-black/50 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
