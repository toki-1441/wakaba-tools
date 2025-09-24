// app/image-resizer/page.tsx
'use client';

import { useState } from 'react';
import styles from './page.module.css';

type Unit = 'px' | '%';

const ImageResizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [percentage, setPercentage] = useState(100);
  const [unit, setUnit] = useState<Unit>('px');
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResizedUrl(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          setDimensions({ width: img.width, height: img.height });
          setPercentage(100);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDim = { ...dimensions, [name]: parseInt(value, 10) || 0 };

    if (maintainAspectRatio && originalImage) {
      const aspectRatio = originalImage.width / originalImage.height;
      if (name === 'width') {
        newDim.height = Math.round(newDim.width / aspectRatio);
      } else {
        newDim.width = Math.round(newDim.height * aspectRatio);
      }
    }
    setDimensions(newDim);
  };
  
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(parseInt(e.target.value, 10) || 0);
  };


  const handleResize = () => {
    if (!originalImage) return;
    setIsLoading(true);

    let targetWidth = dimensions.width;
    let targetHeight = dimensions.height;

    if (unit === '%') {
      targetWidth = Math.round(originalImage.width * (percentage / 100));
      targetHeight = Math.round(originalImage.height * (percentage / 100));
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        if (blob) {
          setResizedUrl(URL.createObjectURL(blob));
        }
        setIsLoading(false);
      }, selectedFile?.type);
    }
  };
  
  return (
    <div className={styles.container}>
      <h2>画像リサイザー</h2>
      <div className={styles.uploadArea}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {!originalImage && <p>ここにファイルをドラッグ＆ドロップするか、クリックして選択</p>}
        {originalImage && <img src={originalImage.src} alt="Original Preview" className={styles.previewImage} />}
      </div>

      {originalImage && (
        <div className={styles.controls}>
          <div className={styles.unitSelector}>
            <button onClick={() => setUnit('px')} className={unit === 'px' ? styles.active : ''}>Pixel</button>
            <button onClick={() => setUnit('%')} className={unit === '%' ? styles.active : ''}>Percent</button>
          </div>

          {unit === 'px' ? (
            <>
              <div className={styles.dimensionInput}>
                <label>幅</label>
                <input type="number" name="width" value={dimensions.width} onChange={handleDimensionChange} />
                <span>px</span>
              </div>
              <div className={styles.dimensionInput}>
                <label>高さ</label>
                <input type="number" name="height" value={dimensions.height} onChange={handleDimensionChange} />
                <span>px</span>
              </div>
              <div className={styles.checkboxWrapper}>
                <input 
                  type="checkbox" 
                  id="aspectRatio" 
                  checked={maintainAspectRatio} 
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)} 
                />
                <label htmlFor="aspectRatio">アスペクト比を維持</label>
              </div>
            </>
          ) : (
            <div className={styles.dimensionInput}>
              <label>拡大率</label>
              <input type="number" name="percentage" value={percentage} onChange={handlePercentageChange} min="1" max="500" />
              <span>%</span>
            </div>
          )}
          
          <button onClick={handleResize} disabled={isLoading} className={styles.button}>
            {isLoading ? '処理中...' : 'リサイズ'}
          </button>
        </div>
      )}

      {resizedUrl && (
         <div className={styles.downloadArea}>
          <p>✅ リサイズが完了しました！</p>
          <img src={resizedUrl} alt="Resized" className={styles.previewImage} />
          <a href={resizedUrl} download={`resized_${selectedFile?.name}`} className={styles.downloadLink}>
            画像をダウンロード
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageResizer;