// ─── Product Attribute Groups ──────────────────────────────────────────────
// Used by the Create Product page to populate select dropdowns.

export interface AttributeGroup {
    key: string;
    label: string;
    items: string[];
}

export const attributeGroups: AttributeGroup[] = [
    {
        key: "metal",
        label: "Metal Type",
        items: ["Gold", "Silver", "Platinum", "Palladium"],
    },
    {
        key: "weight_oz",
        label: "Weight",
        items: [
            "1 g",
            "2 g",
            "5 g",
            "1/10 oz",
            "1/4 oz",
            "1/2 oz",
            "1 oz",
            "2 oz",
            "5 oz",
            "10 oz",
            "1 kg",
        ],
    },
    {
        key: "purity",
        label: "Purity",
        items: [
            ".999 Fine",
            ".9999 Fine",
            ".99999 Fine",
            ".925 Sterling",
            ".9167 (22k)",
        ],
    },
    {
        key: "mint",
        label: "Mint",
        items: [
            "PAMP Suisse",
            "Royal Canadian Mint",
            "Perth Mint",
            "United States Mint",
            "Royal Mint",
            "Austrian Mint",
            "Rand Refinery",
            "Sunshine Mint",
            "Johnson Matthey",
            "Engelhard",
            "Valcambi",
            "Argor-Heraeus",
            "Credit Suisse",
        ],
    },
    {
        key: "category",
        label: "Category",
        items: ["Bar", "Coin", "Round"],
    },
];

// ─── Lookup helper ─────────────────────────────────────────────────────────

export function getAttributeGroup(key: string): AttributeGroup | undefined {
    return attributeGroups.find((g) => g.key === key);
}

// ─── Weight conversion: label → decimal oz ────────────────────────────────

const WEIGHT_MAP: Record<string, number> = {
    "1 g":    0.0322,
    "2 g":    0.0643,
    "5 g":    0.1608,
    "1/10 oz": 0.1,
    "1/4 oz":  0.25,
    "1/2 oz":  0.5,
    "1 oz":    1.0,
    "2 oz":    2.0,
    "5 oz":    5.0,
    "10 oz":  10.0,
    "1 kg":   32.1507,
};

export function weightLabelToOz(label: string): number {
    return WEIGHT_MAP[label] ?? 1.0;
}

export function ozToWeightLabel(oz: number): string {
    // Find the closest label
    let closest = "1 oz";
    let minDiff = Infinity;
    for (const [label, val] of Object.entries(WEIGHT_MAP)) {
        const diff = Math.abs(val - oz);
        if (diff < minDiff) {
            minDiff = diff;
            closest = label;
        }
    }
    return closest;
}

// ─── Purity conversion: label → decimal ───────────────────────────────────

const PURITY_MAP: Record<string, number> = {
    ".999 Fine":    0.999,
    ".9999 Fine":   0.9999,
    ".99999 Fine":  0.99999,
    ".925 Sterling": 0.925,
    ".9167 (22k)":  0.9167,
};

export function purityLabelToNumber(label: string): number {
    return PURITY_MAP[label] ?? 0.9999;
}

export function numberToPurityLabel(val: number): string {
    let closest = ".9999 Fine";
    let minDiff = Infinity;
    for (const [label, num] of Object.entries(PURITY_MAP)) {
        const diff = Math.abs(num - val);
        if (diff < minDiff) {
            minDiff = diff;
            closest = label;
        }
    }
    return closest;
}
