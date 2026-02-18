// Big Box (Costco) product data
// Each product has online and in-store availability, prices, and Luxey sale prices

export interface BigBoxProduct {
    id: string;
    name: string;
    sku: string;
    weight: string;
    image: string;
    // Online availability
    onlineAvailable: boolean;
    onlinePrice: number;
    // In-store availability (warehouse)
    inStoreAvailable: boolean;
    inStorePrice: number;
    // Luxey sale prices
    spotPrice: number;
    bgsPrice: number;
    // Meta
    lastChecked: string; // relative time
}

export const bigBoxProducts: BigBoxProduct[] = [
    {
        id: "bb-rand-refinery-1oz",
        name: "1 oz Gold Bar Rand Refinery (New in Assay)",
        sku: "1943085",
        weight: "1 oz",
        image: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold-Krugerrand.png",
        onlineAvailable: false,
        onlinePrice: 2849.99,
        inStoreAvailable: false,
        inStorePrice: 2829.99,
        spotPrice: 2744.58,
        bgsPrice: 2711.26,
        lastChecked: "3 min ago",
    },
    {
        id: "bb-argor-heraeus-1oz",
        name: "1 oz Gold Bar Argor Heraeus Origin Traced (New in Assay)",
        sku: "1999612",
        weight: "1 oz",
        image: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg",
        onlineAvailable: false,
        onlinePrice: 2849.99,
        inStoreAvailable: false,
        inStorePrice: 2829.99,
        spotPrice: 2744.58,
        bgsPrice: 2711.26,
        lastChecked: "3 min ago",
    },
    {
        id: "bb-pamp-veriscan-1oz",
        name: "1 oz Gold Bar PAMP Suisse Lady Fortuna Veriscan (New in Assay)",
        sku: "1943308",
        weight: "1 oz",
        image: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg",
        onlineAvailable: false,
        onlinePrice: 2849.99,
        inStoreAvailable: true,
        inStorePrice: 2819.99,
        spotPrice: 2744.58,
        bgsPrice: 2716.26,
        lastChecked: "3 min ago",
    },
    {
        id: "bb-pamp-veriscan-100g",
        name: "100 Gram Gold Bar PAMP Suisse Lady Fortuna Veriscan (New in Assay)",
        sku: "1801206",
        weight: "100g",
        image: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg",
        onlineAvailable: false,
        onlinePrice: 9199.99,
        inStoreAvailable: false,
        inStorePrice: 9149.99,
        spotPrice: 8918.68,
        bgsPrice: 8849.42,
        lastChecked: "Just now",
    },
    {
        id: "bb-american-eagle-1oz",
        name: "2024 1 oz American Gold Eagle $50 Coin BU",
        sku: "2045891",
        weight: "1 oz",
        image: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold-American-Eagle.png",
        onlineAvailable: true,
        onlinePrice: 2889.99,
        inStoreAvailable: false,
        inStorePrice: 2869.99,
        spotPrice: 2744.58,
        bgsPrice: 2728.50,
        lastChecked: "5 min ago",
    },
    {
        id: "bb-buffalo-1oz",
        name: "2024 1 oz American Gold Buffalo $50 Coin BU",
        sku: "2045892",
        weight: "1 oz",
        image: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold-American-Buffalo.png",
        onlineAvailable: true,
        onlinePrice: 2879.99,
        inStoreAvailable: true,
        inStorePrice: 2859.99,
        spotPrice: 2744.58,
        bgsPrice: 2725.80,
        lastChecked: "2 min ago",
    },
    {
        id: "bb-maple-1oz",
        name: "2024 1 oz Canadian Gold Maple Leaf $50 Coin BU",
        sku: "2048123",
        weight: "1 oz",
        image: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold-Canadian-Maple-leaf.png",
        onlineAvailable: false,
        onlinePrice: 2869.99,
        inStoreAvailable: false,
        inStorePrice: 2849.99,
        spotPrice: 2744.58,
        bgsPrice: 2720.10,
        lastChecked: "8 min ago",
    },
];
