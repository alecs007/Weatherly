import styles from "./Header.module.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.theme_button}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
