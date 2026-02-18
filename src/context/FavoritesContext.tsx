"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface FavoritesContextType {
    favorites: Set<string>;
    toggleFavorite: (productId: string) => void;
    isFavorited: (productId: string) => boolean;
    count: number;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: new Set(),
    toggleFavorite: () => { },
    isFavorited: () => false,
    count: 0,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const toggleFavorite = useCallback((productId: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    }, []);

    const isFavorited = useCallback((productId: string) => {
        return favorites.has(productId);
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited, count: favorites.size }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
