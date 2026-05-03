"use client";

import { ReactNode } from "react";

export function ResponsiveGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "0.85rem",
      }}
      className="ig-grid"
    >
      <style>{`
        .ig-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (min-width: 640px) {
          .ig-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }
        @media (min-width: 1024px) {
          .ig-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
          }
        }
      `}</style>
      {children}
    </div>
  );
}
