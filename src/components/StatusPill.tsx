import React from "react";

type PillVariant =
    | "gold"
    | "silver"
    | "bronze"
    | "complete"
    | "progress"
    | "pending";

interface StatusPillProps {
    label: string;
    variant?: PillVariant;
    className?: string;
}

const variantClasses: Record<PillVariant, string> = {
    gold: "pill-gold",
    silver: "pill-silver",
    bronze: "pill-bronze",
    complete: "pill-complete",
    progress: "pill-progress",
    pending: "pill-pending",
};

export default function StatusPill({
    label,
    variant = "pending",
    className = "",
}: StatusPillProps) {
    return (
        <span className={`status-pill ${variantClasses[variant]} ${className}`}>
            {label}
        </span>
    );
}
