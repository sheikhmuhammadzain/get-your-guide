"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

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
const THEME_EVENT = "theme:changed";

function readStoredTheme(): Theme | null {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "dark" || stored === "light") return stored;
    } catch {
        // localStorage not available
    }
    return null;
}

function getThemeSnapshot(): Theme {
    const storedTheme = readStoredTheme();
    if (storedTheme) {
        return storedTheme;
    }
    if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
        return "dark";
    }
    return "light";
}

function subscribeToTheme(callback: () => void) {
    if (typeof window === "undefined") {
        return () => {};
    }

    const onChange = () => callback();
    window.addEventListener(THEME_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
        window.removeEventListener(THEME_EVENT, onChange);
        window.removeEventListener("storage", onChange);
    };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");

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
        const nextTheme = theme === "dark" ? "light" : "dark";
        try {
            window.localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
            // localStorage not available
        }
        window.dispatchEvent(new Event(THEME_EVENT));
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
