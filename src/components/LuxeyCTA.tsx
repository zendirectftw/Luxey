import React from "react";

interface LuxeyCTAProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit";
    fullWidth?: boolean;
}

export default function LuxeyCTA({
    children,
    onClick,
    className = "",
    type = "button",
    fullWidth = false,
}: LuxeyCTAProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`luxey-cta group ${fullWidth ? "w-full" : ""} ${className}`}
        >
            {children}
            <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="cta-bolt-circle" />
                <span className="cta-bolt">⚡</span>
            </div>
        </button>
    );
}
