"use client";

import { UserProvider } from "@/context/UserContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider } from "@/context/CartContext";
import { ProfitProfileProvider } from "@/context/ProfitProfileContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <FavoritesProvider>
                <CartProvider>
                    <ProfitProfileProvider>{children}</ProfitProfileProvider>
                </CartProvider>
            </FavoritesProvider>
        </UserProvider>
    );
}

