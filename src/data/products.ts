import { Product } from "@/components/ProductCard";

// Sample product data extracted from the HTML prototypes
// This will be replaced with real data from Supabase once the admin portal is built

export const sampleProducts: Product[] = [
    {
        id: "pamp-fortuna-1oz",
        name: "1 oz PAMP Lady Fortuna Gold Bar",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "PAMP Suisse",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg",
        bid: "$2,412",
        ask: "$2,442",
        category: "Gold Bars",
    },
    {
        id: "american-buffalo-1oz",
        name: "1 oz American Buffalo Gold Coin",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "U.S. Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold-American-Buffalo.png",
        bid: "$2,428",
        ask: "$2,458",
        category: "Gold Coins",
    },
    {
        id: "canadian-maple-1oz",
        name: "1 oz Canadian Maple Leaf Gold",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "Royal Canadian Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold-Canadian-Maple-leaf.png",
        bid: "$2,420",
        ask: "$2,450",
        category: "Gold Coins",
    },
    {
        id: "gold-eagle-1oz",
        name: "1 oz American Gold Eagle",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "U.S. Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold-American-Eagle.png",
        bid: "$2,435",
        ask: "$2,465",
        category: "Gold Coins",
    },
    {
        id: "krugerrand-1oz",
        name: "1 oz South African Krugerrand",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "SA Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold-Krugerrand.png",
        bid: "$2,410",
        ask: "$2,440",
        category: "Gold Coins",
    },
    {
        id: "british-britannia-1oz",
        name: "1 oz British Britannia Gold",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "Royal Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/british-britannia.png",
        bid: "$2,418",
        ask: "$2,448",
        category: "Gold Coins",
    },
    {
        id: "pamp-veriscan-1oz",
        name: "1 oz PAMP Suisse Gold Bar (Veriscan)",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "PAMP Suisse",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg",
        bid: "$2,415",
        ask: "$2,445",
        category: "Gold Bars",
    },
    {
        id: "austrian-philharmonic-1oz",
        name: "1 oz Austrian Philharmonic Gold",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "Austrian Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Austrian-Philharmonic.png",
        bid: "$2,422",
        ask: "$2,452",
        category: "Gold Coins",
    },
    {
        id: "silver-eagle-1oz",
        name: "1 oz American Silver Eagle",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "U.S. Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Silver-American-Eagle.png",
        bid: "$28.50",
        ask: "$31.20",
        category: "Silver",
    },
    {
        id: "silver-maple-1oz",
        name: "1 oz Canadian Silver Maple Leaf",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "Royal Canadian Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Silver-Canadian-Maple-Leaf.png",
        bid: "$27.80",
        ask: "$30.50",
        category: "Silver",
    },
    {
        id: "platinum-eagle-1oz",
        name: "1 oz American Platinum Eagle",
        weight: "1 Troy Oz",
        weightLabel: "1 oz",
        mint: "U.S. Mint",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Platinum-American-Eagle.png",
        bid: "$962",
        ask: "$1,015",
        category: "Platinum",
    },
    {
        id: "pamp-fortuna-100g",
        name: "100gm PAMP Lady Fortuna Gold Bar",
        weight: "100 Grams",
        weightLabel: "100gm",
        mint: "PAMP Suisse",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg",
        bid: "$7,752",
        ask: "$7,852",
        category: "Gold Bars",
    },
    {
        id: "pamp-fortuna-10oz",
        name: "10 oz PAMP Lady Fortuna Gold Bar",
        weight: "10 Troy Oz",
        weightLabel: "10 oz",
        mint: "PAMP Suisse",
        image:
            "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg",
        bid: "$24,120",
        ask: "$24,420",
        category: "Gold Bars",
    },
];

export const categories = [
    "All",
    "Gold Bars",
    "Gold Coins",
    "Silver",
];

export const weightFilters = [
    "1 oz",
    "100gm",
];

