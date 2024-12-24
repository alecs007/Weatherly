import { useState, useEffect } from "react";
import styles from "./ThemeToggle.module.css";
import theme_mode from "../../assets/theme_mode.png";

function ThemeToggle() {
  const getDefaultTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme;
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getDefaultTheme);
  const [flipped, setFlipped] = useState(theme === "dark" ? false : true);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    setFlipped(theme === "dark" ? true : false);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "light" ? "#ffffffde" : "#000000de"
      );
    }
  }, [theme]);

  return (
    <button
      onClick={() => {
        toggleTheme();
      }}
      className={`${styles.button} ${flipped ? styles.flipped : ""}`}
    >
      <p>{theme === "light" ? "Light" : "Dark"}</p>
      <img src={theme_mode} alt="theme mode" />
    </button>
  );
}

export default ThemeToggle;
