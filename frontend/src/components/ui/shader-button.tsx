"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "default" | "violet";
}

const GRADIENT_LAYERS = [
  { delay: "0s", duration: "25s" },
  { delay: "0.15s", duration: "15.9s" },
  { delay: "0.53s", duration: "26.4s" },
  { delay: "0.45s", duration: "17.8s" },
  { delay: "1.6s", duration: "19.2s" },
  { delay: "1.6s", duration: "29.2s" },
  { delay: "1.6s", duration: "20.2s" },
];

export const GradientButton = React.forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(({ className, variant = "default", children = "Start", type = "button", style, ...props }, ref) => {
  return (
    <>
      <style>{`
        .btn-wrapper-root {
          --rad: 32px;
          --color-wrapper-border: #ffffff;
          --color-btn-bg: transparent;
          --color-btn-text: #ffffff;
          --color-btn-text-shadow: transparent;
          --color-btn-inset-shadow: transparent;
          --color-layer-a: #ffffff;
          --color-layer-b: #0000ff;
          --color-overlay-text: #ffffff;
          --color-overlay-glow: transparent;
          --color-overlay-shadow: transparent;
          --color-overlay-highlight: transparent;

          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: clip;
          overflow-clip-margin: 4px;
          padding: 0;
          background: transparent;
          cursor: pointer;
          border: 2px solid var(--color-wrapper-border);
          border-radius: var(--rad);
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          user-select: none;
          outline: none;
          transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .btn-wrapper-root.btn-violet {
          --color-wrapper-border: #9b8afb;
          --color-layer-a: #9b8afb;
          --color-layer-b: #3d1b95;
          background: linear-gradient(135deg, #7c5cf7 0%, #3d1b95 100%);
          box-shadow: 0 0 20px rgba(155, 138, 251, 0.4);
        }

        .btn-wrapper-root.btn-violet:hover {
          --color-wrapper-border: #c4b5fd;
          box-shadow: 0 0 25px rgba(196, 181, 253, 0.6);
        }

        .btn-wrapper-root:active {
          transform: scale(0.96);
        }

        .btn-wrapper-root:focus-visible {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }

        .btn-wrapper-root .gradient-layer {
          position: absolute;
          pointer-events: none;
          left: -160px;
          width: 500%;
          aspect-ratio: 1;
          background: radial-gradient(
            ellipse at 65% 180%,
            var(--color-layer-a),
            var(--color-layer-b),
            var(--color-layer-a),
            var(--color-layer-b),
            var(--color-layer-a),
            var(--color-layer-b),
            var(--color-layer-a),
            var(--color-layer-b),
            var(--color-layer-a),
            var(--color-layer-b),
            var(--color-layer-a)
          );
          mix-blend-mode: difference;
          animation: none;
        }

        .btn-wrapper-root .gradient-layer:nth-child(8) {
          mix-blend-mode: color-dodge;
        }

        .btn-wrapper-root .gradient-bg {
          position: relative;
          z-index: 0;
          padding: 10px 28px;
          border: none;
          border-radius: var(--rad);
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: 0.08rem;
          color: #ffffff;
          background-color: transparent;
          background-size: 200% 200%;
          box-shadow: none;
          text-shadow: none;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-wrapper-root .gradient-bg::after {
          content: "";
          position: absolute;
          pointer-events: none;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: var(--rad);
          background-size: 200% 200%;
          mix-blend-mode: difference;
          z-index: 1;
        }

        .btn-wrapper-root .text-overlay {
          position: absolute;
          pointer-events: none;
          z-index: 2;
          padding: 10px 28px;
          border-radius: var(--rad);
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: 0.08rem;
          color: #ffffff;
          text-shadow: none;
          box-shadow: none;
          mix-blend-mode: normal;
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-wrapper-root:hover .text-overlay {
          transform: scale(1.04);
        }

        .btn-wrapper-root .light-bar {
          position: absolute;
          pointer-events: none;
          z-index: 1;
          border-radius: 50px;
          width: 80%;
          height: 1.9rem;
          aspect-ratio: 1;
          background-color: rgba(255, 255, 255, 0.2);
          filter: blur(5px);
          opacity: 0.5;
        }
      `}</style>

      <button
        ref={ref}
        type={type}
        className={cn(
          "btn-wrapper-root",
          variant === "violet" && "btn-violet",
          className
        )}
        style={style}
        {...props}
      >
        <div className="light-bar" />
        {GRADIENT_LAYERS.map((layer, index) => (
          <div
            key={index}
            className="gradient-layer"
            style={{
              animationDelay: layer.delay,
              animationDuration: layer.duration,
            }}
          />
        ))}
        <div className="gradient-bg">{children}</div>
        <div className="text-overlay">{children}</div>
      </button>
    </>
  );
});

GradientButton.displayName = "GradientButton";

export default GradientButton;
