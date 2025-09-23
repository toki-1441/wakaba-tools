import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Wakaba Toolsへようこそ！ 🌿</h1>
      <p className={styles.description}>
        左のメニューから利用したいツールを選択してください。
      </p>
      <p className={styles.privacyInfo}>
        このサイトのツールはすべて、あなたのブラウザの中だけで動作します。
        <br />
        データが外部に送信されることはありませんので、安心してご利用ください。
      </p>
    </div>
  );
}