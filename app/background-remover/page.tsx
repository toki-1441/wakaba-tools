// app/background-remover/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import styles from './page.module.css';

type Status = 'idle' | 'processing' | 'success' | 'error';

const BackgroundRemover = () => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [removedBgUrl, setRemovedBgUrl] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>(''); // New state for progress text

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRemovedBgUrl('');
    setError(null);
    if (imgSrc) URL.revokeObjectURL(imgSrc);
    
    const newImgSrc = URL.createObjectURL(file);
    setImgSrc(newImgSrc);
    
    processImage(newImgSrc);
  };

  const processImage = useCallback(async (source: string) => {
    setStatus('processing');
    setError(null);
    setProgress('準備中...'); // Initial progress message

    try {
      const resultBlob = await removeBackground(source, {
        // This is the crucial addition: a progress callback
        progress: (key, current, total) => {
          const percentage = Math.round((current / total) * 100);
          setProgress(`${key} ${percentage}%`);
        }
      });
      
      const url = URL.createObjectURL(resultBlob);
      setRemovedBgUrl(url);
      setStatus('success');
      setProgress(''); // Clear progress on success
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || '画像の処理中にエラーが発生しました。');
      setStatus('error');
      console.error(err);
    }
  }, []);
  
  const ResultDisplay = () => {
    switch (status) {
      case 'processing':
        // Display the detailed progress message
        return <div className={styles.loader}>{progress}</div>;
      case 'success':
        return <img src={removedBgUrl} alt="Background Removed" />;
      case 'error':
        return <p className={styles.error}>{error}</p>;
      default:
        return <p className={styles.placeholder}>ここに結果が表示されます</p>;
    }
  };

  return (
    <div className={styles.container}>
      <h2>AI 背景除去ツール</h2>
      <p className={styles.description}>
        最新のAIモデルが、写真から背景を自動で取り除きます。
      </p>

      <div className={styles.uploadArea}>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={status === 'processing'}/>
        <p>ここにファイルをドラッグ＆ドロップするか、クリックして選択</p>
      </div>
      
      <div className={styles.workspace}>
        {imgSrc && (
          <div className={styles.imageContainer}>
            <h3>Original</h3>
            <img src={imgSrc} alt="Original" />
          </div>
        )}
        {(status !== 'idle' || removedBgUrl) && (
          <div className={styles.imageContainer}>
            <h3>Result</h3>
            <div className={styles.resultBox}>
              <ResultDisplay />
            </div>
          </div>
        )}
      </div>

      {status === 'success' && removedBgUrl && (
        <div className={styles.downloadArea}>
          <a href={removedBgUrl} download="background-removed.png" className={styles.downloadLink}>
            画像をダウンロード (PNG)
          </a>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;