import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Product Inventory | Luxey© Admin" };

const products = [
    { id: 1, name: "1 oz Lady Fortuna", category: "Gold Bars", metal: "Gold", weight: "1 oz", status: "Featured", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg" },
    { id: 2, name: "1 oz Gold Buffalo BU", category: "Gold Coins", metal: "Gold", weight: "1 oz", status: "Active", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Buffalo%20Rev.jpg" },
    { id: 3, name: "1 oz Gold Eagle BU", category: "Gold Coins", metal: "Gold", weight: "1 oz", status: "Featured", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold%20Eagle%20rev.jpg" },
    { id: 4, name: "100g Valcambi Bar", category: "Gold Bars", metal: "Gold", weight: "100g", status: "Active", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Valcambi%20100%20gm%20Gold%20Bar.png" },
    { id: 5, name: "1 oz Gold Krugerrand", category: "Gold Coins", metal: "Gold", weight: "1 oz", status: "Draft", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Rand%20Refinery%201%20oz%20Gold%20Bar.png" },
    { id: 6, name: "10 oz RCM Gold Bar", category: "Gold Bars", metal: "Gold", weight: "10 oz", status: "Active", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Perth%20Mint%201%20oz%20Gold%20Bar.png" },
    { id: 7, name: "1 oz Silver Maple Leaf", category: "Silver Coins", metal: "Silver", weight: "1 oz", status: "Active", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold%20Eagle%20rev.jpg" },
];

export default function ProductsPage() {
    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Inventory</h2>
                <Link
                    href="/admin/products/create"
                    className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-all"
                >
                    + New Product
                </Link>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Search & Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input type="text" placeholder="Search products..." className="w-full pl-12 pr-6 py-3 bg-white border border-[#E4E4E4] rounded-sm text-sm font-medium outline-none focus:border-black transition-all" />
                    </div>
                    <select className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest">
                        <option>All Categories</option>
                        <option>Gold Coins</option>
                        <option>Gold Bars</option>
                        <option>Silver Coins</option>
                    </select>
                    <select className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest">
                        <option>All Status</option>
                        <option>Featured</option>
                        <option>Active</option>
                        <option>Draft</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Metal</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Weight</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-[#FAFAFA] transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 p-1 flex-shrink-0">
                                            <Image src={product.img} alt={product.name} width={32} height={32} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-tight">{product.name}</span>
                                    </td>
                                    <td className="p-4 text-xs font-medium text-gray-600">{product.category}</td>
                                    <td className="p-4 text-xs font-medium text-gray-600">{product.metal}</td>
                                    <td className="p-4 text-xs font-medium text-gray-600">{product.weight}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${product.status === "Featured" ? "bg-green-50 text-green-700" :
                                                product.status === "Active" ? "bg-blue-50 text-blue-700" :
                                                    "bg-gray-100 text-gray-500"
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href="/admin/products/create" className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
