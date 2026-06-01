'use client'

import { useEffect, useState } from "react";

interface AuthUser {
    id: number;
    name: string;
}

const getStoredUser = (): AuthUser | null => {
    if (typeof window === "undefined") {
        return null;
    }

    const storedId = localStorage.getItem("userId");
    if (storedId) {
        const id = parseInt(storedId, 10);
        return {
            id,
            name: `User${id}`,
        };
    }

    const id = Math.floor(Math.random() * 1000);
    localStorage.setItem("userId", id.toString());
    return {
        id,
        name: `User${id}`,
    };
};

const useAuth = () => {
    const [user] = useState<AuthUser | null>(() => getStoredUser());

    useEffect(() => {
        if (user !== null) {
            return;
        }
    }, [user]);

    return {
        isAuthenticated: user !== null,
        user,
    };
};

export default useAuth;
