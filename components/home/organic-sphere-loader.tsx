"use client";

import React from "react";

export default function OrganicSphereLoader() {
  const angles = [0, 20, 40, 60, 80, 100, 120, 140, 160];
  const ballDelays = [
    "0s",
    "0.2s",
    "0.4s",
    "0.6s",
    "0.8s",
    "1.0s",
    "1.2s",
    "1.4s",
    "1.6s",
    "1.8s",
  ];

  return (
    <div className="relative flex items-center justify-center p-6 text-[13px] sm:text-[15px] lg:text-[16px] select-none pointer-events-none">
      {/* Background Soft Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-blue-100/60 via-slate-100/50 to-indigo-100/40 blur-2xl"
      />

      {/* Main Loader Container */}
      <div className="relative flex size-[14em] items-center justify-center">
        {/* Track loaders (background static channels) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {angles.map((deg, i) => (
            <div
              key={`track-${i}`}
              className="organic-loader-track"
              style={{ transform: `rotate(${deg}deg)` }}
            />
          ))}
        </div>

        {/* Orbiting Balls */}
        <div className="absolute inset-0 flex items-center justify-center">
          {angles.map((deg, i) => (
            <div
              key={`ball-track-${i}`}
              className="absolute h-[13em] w-[1.15em] rounded-[50px] bg-transparent flex justify-center"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div
                className="organic-ball"
                style={{ animationDelay: ballDelays[i] || "0s" }}
              />
            </div>
          ))}
          {/* 10th ball for symmetry */}
          <div
            className="absolute h-[13em] w-[1.15em] rounded-[50px] bg-transparent flex justify-center"
            style={{ transform: "rotate(180deg)" }}
          >
            <div
              className="organic-ball"
              style={{ animationDelay: ballDelays[9] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
