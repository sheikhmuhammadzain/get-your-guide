"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    toggleTheme: () => { },
});

const STORAGE_KEY = "gyg-theme";

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "light";
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "dark" || stored === "light") return stored;
    } catch {
        // localStorage not available
    }
    return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    /* Apply class to <html> whenever theme changes */
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // localStorage not available
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
