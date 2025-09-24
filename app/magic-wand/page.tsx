// app/magic-wand/page.tsx
'use client';

import { useState, useRef, MouseEvent } from 'react';
import styles from './page.module.css';

const MagicWandTool = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [status, setStatus] = useState<string>('idle');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProcessedUrl('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setOriginalImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number) => {
    setStatus('processing');
    const tolerance = 20;

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const { data, width, height } = imageData;
    const visited = new Uint8Array(width * height);
    const queue: [number, number][] = [[startX, startY]];

    const startIndex = (startY * width + startX) * 4;
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];

    if (visited[startY * width + startX]) return; // Already processed
    visited[startY * width + startX] = 1;

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const currentIndex = (y * width + x) * 4;
      data[currentIndex + 3] = 0; // Make transparent

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny * width + nx]) {
            const neighborIndex = (ny * width + nx) * 4;
            const r = data[neighborIndex];
            const g = data[neighborIndex + 1];
            const b = data[neighborIndex + 2];
            
            // THE CRITICAL FIX:
            // Check if the neighbor's color is similar to the STARTING color.
            const colorDiff = Math.sqrt(Math.pow(r - startR, 2) + Math.pow(g - startG, 2) + Math.pow(b - startB, 2));

            if (colorDiff <= tolerance) {
              visited[ny * width + nx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    setProcessedUrl(ctx.canvas.toDataURL('image/png'));
    setStatus('success');
  };

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    if (!originalImage || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    ctx.drawImage(originalImage, 0, 0);
    
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = originalImage.naturalWidth / rect.width;
    const scaleY = originalImage.naturalHeight / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    
    floodFill(ctx, x, y);
  };
  
  return (
    <div className={styles.container}>
      <h2>マジック透過ツール</h2>
      <p className={styles.description}>画像のクリックした箇所と、それに隣接する近い色の部分を透過します。</p>
      
      <div className={styles.uploadArea}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <p>画像ファイルを選択してください</p>
      </div>

      {originalImage && (
        <>
          <p className={styles.instructions}>👇下の画像をクリックして、透過したい背景の開始点を選択してください。</p>

          <div className={styles.workspace}>
            <div className={styles.imageContainer}>
              <h3>Original</h3>
              <img 
                ref={imageRef} 
                src={originalImage.src} 
                alt="Original - Click to select a point" 
                onClick={handleImageClick}
                className={styles.clickableImage}
              />
            </div>
            <div className={styles.imageContainer}>
              <h3>Result</h3>
              <div className={styles.resultBox}>
                {status === 'processing' && <p>処理中...</p>}
                {status === 'success' && <img src={processedUrl} alt="Processed" />}
              </div>
            </div>
          </div>
          
          {processedUrl && (
            <div className={styles.downloadArea}>
              <a href={processedUrl} download="magic-transparent.png" className={styles.downloadLink}>
                画像をダウンロード (PNG)
              </a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default MagicWandTool;