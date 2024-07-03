"use client";
import React, { PropsWithChildren, createContext, useState } from 'react'

type Theme = "light" | "dark";

type ThemeContextProp = {
    theme: Theme,
    toogleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextProp>({} as ThemeContextProp)

export default function ThemeProvider({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState<Theme>("light");
    function toogleTheme() {
        setTheme(theme === "light" ? "dark" : "light");
    }
  return (
    <ThemeContext.Provider value={{theme, toogleTheme}}>
        { children }
    </ThemeContext.Provider>
  )
}
