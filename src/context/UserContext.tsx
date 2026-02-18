"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
    name: string;
    email: string;
    isAdmin: boolean;
}

interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

/* ── Default mock user (admin for dev) ──────────── */
const defaultUser: User = {
    name: "Jerrold",
    email: "jg@luxey.com",
    isAdmin: true,          // ← flip to false to hide admin link
};

const UserContext = createContext<UserContextType>({
    user: defaultUser,
    setUser: () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(defaultUser);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
