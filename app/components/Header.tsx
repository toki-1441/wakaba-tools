// app/components/Header.tsx
import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <h1>Wakaba Tools 🌿</h1>
      </Link>
      <div className={styles.author}>
        <span>by toki-1441</span>
        <a href="https://github.com/toki-1441" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
          
        </a>
      </div>
    </header>
  );
};

export default Header;