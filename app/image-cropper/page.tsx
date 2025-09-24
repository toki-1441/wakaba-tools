// app/image-cropper/page.tsx
'use client';

import { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './page.module.css';

const ImageCropper = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [croppedUrl, setCroppedUrl] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCroppedUrl('');
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedUrl(URL.createObjectURL(blob));
        }
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>画像クロップ</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {imgSrc && (
        <div className={styles.cropContainer}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={16 / 9} // Example aspect ratio
          >
            <img ref={imgRef} src={imgSrc} style={{ maxHeight: '70vh' }} />
          </ReactCrop>
          <button onClick={handleCrop} className={styles.button}>クロップ</button>
        </div>
      )}

      {croppedUrl && (
        <div className={styles.downloadArea}>
          <p>✅ クロップが完了しました！</p>
          <img src={croppedUrl} alt="Cropped" className={styles.previewImage} />
          <a href={croppedUrl} download="cropped-image.png" className={styles.downloadLink}>
            画像をダウンロード
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;