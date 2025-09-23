// app/components/Footer.tsx
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© 2025 toki-1441</p>
      <p className={styles.privacy}>
        このサイトは全ての処理をブラウザ内で完結させており、あなたのデータをサーバーに送信することはありません。
      </p>
    </footer>
  );
};

export default Footer;