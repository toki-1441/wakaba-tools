"use client";

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // ★ 変更点: QRCodeCanvasを名前付きでインポート
import styles from './page.module.css';

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState('');
  const [qrText, setQrText] = useState('');

  const handleGenerateClick = () => {
    setQrText(text);
  };

  const handleDownloadClick = () => {
    const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>QRコード生成</h1>
      <p className={styles.description}>
        テキストやURLを入力して、QRコードを生成します。
      </p>

      <div className={styles.inputSection}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここにURLやテキストを入力..."
          rows={4}
        />
        <button
          className={styles.button}
          onClick={handleGenerateClick}
          disabled={!text}
        >
          QRコードを生成
        </button>
      </div>

      {qrText && (
        <div className={styles.qrSection}>
          <div className={styles.qrCodeWrapper}>
            {/* ★ 変更点: コンポーネント名をQRCodeCanvasに変更 */}
            <QRCodeCanvas
              id="qrcode-canvas"
              value={qrText}
              size={256}
              level={'H'}
              includeMargin={true}
            />
          </div>
          <button
            className={styles.button}
            onClick={handleDownloadClick}
          >
            PNG形式でダウンロード
          </button>
        </div>
      )}
    </div>
  );
}