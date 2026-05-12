"use client";

import React, { useEffect, useState } from "react";

export default function TopographyBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  const translateX = mousePos.x * -30;
  const translateY = mousePos.y * -30;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
      <div
        className="absolute inset-[-10%] opacity-[0.15] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(1.1)`,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1400 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" stroke="#b5722a" strokeWidth="1.2">
            {/* Peak A — left-center area */}
            <ellipse cx="380" cy="430" rx="30"  ry="18" />
            <ellipse cx="380" cy="430" rx="70"  ry="45" />
            <ellipse cx="380" cy="430" rx="115" ry="75" />
            <ellipse cx="380" cy="430" rx="162" ry="108" />
            <ellipse cx="380" cy="430" rx="212" ry="142" />
            <ellipse cx="380" cy="430" rx="265" ry="178" />
            <ellipse cx="380" cy="430" rx="320" ry="215" />
            <ellipse cx="380" cy="430" rx="378" ry="254" />
            <ellipse cx="380" cy="430" rx="438" ry="295" />
            <ellipse cx="380" cy="430" rx="500" ry="338" />

            {/* Peak B — right-upper area */}
            <ellipse cx="980" cy="280" rx="25"  ry="20" />
            <ellipse cx="980" cy="280" rx="65"  ry="52" />
            <ellipse cx="980" cy="280" rx="110" ry="88" />
            <ellipse cx="980" cy="280" rx="160" ry="128" />
            <ellipse cx="980" cy="280" rx="215" ry="172" />
            <ellipse cx="980" cy="280" rx="274" ry="219" />
            <ellipse cx="980" cy="280" rx="336" ry="269" />
            <ellipse cx="980" cy="280" rx="402" ry="321" />
            <ellipse cx="980" cy="280" rx="470" ry="376" />
            <ellipse cx="980" cy="280" rx="542" ry="433" />

            {/* Peak C — bottom-right, smaller peak */}
            <ellipse cx="1150" cy="720" rx="20"  ry="15" />
            <ellipse cx="1150" cy="720" rx="55"  ry="42" />
            <ellipse cx="1150" cy="720" rx="95"  ry="73" />
            <ellipse cx="1150" cy="720" rx="140" ry="108" />
            <ellipse cx="1150" cy="720" rx="190" ry="146" />
            <ellipse cx="1150" cy="720" rx="244" ry="188" />
            <ellipse cx="1150" cy="720" rx="302" ry="232" />
          </g>
        </svg>
      </div>
    </div>
  );
}
