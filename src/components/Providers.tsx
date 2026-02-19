"use client";

import { UserProvider } from "@/context/UserContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider } from "@/context/CartContext";
import { ProfitProfileProvider } from "@/context/ProfitProfileContext";
import { SpotPriceProvider } from "@/context/SpotPriceContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SpotPriceProvider>
            <UserProvider>
                <FavoritesProvider>
                    <CartProvider>
                        <ProfitProfileProvider>{children}</ProfitProfileProvider>
                    </CartProvider>
                </FavoritesProvider>
            </UserProvider>
        </SpotPriceProvider>
    );
}


