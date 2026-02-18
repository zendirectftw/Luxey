import React from "react";

interface LuxeyLogoProps {
    size?: number;
    variant?: "dark" | "light";
    className?: string;
}

export default function LuxeyLogo({
    size = 40,
    variant = "dark",
    className = "",
}: LuxeyLogoProps) {
    const bgColor = variant === "dark" ? "#000" : "#FFF";
    const boltColor = "#D4AF37";
    const borderColor = "#D4AF37";

    return (
        <div
            className={`rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
            }}
        >
            <svg
                width={size * 0.5}
                height={size * 0.55}
                viewBox="0 0 24 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M14.5 1L3 16h8.5l-2 11L22 12h-8.5l1-11z"
                    fill={boltColor}
                    stroke={boltColor}
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
