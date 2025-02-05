"use client";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextProp = {
  theme: Theme;
  toogleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextProp>(
  {} as ThemeContextProp
);

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>("light");
  function toogleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }
  return (
    <ThemeContext.Provider value={{ theme, toogleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
