'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConvertedUrl(null);
    setError(null);

    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('ファイルサイズが大きすぎます。10MB以下のファイルを選択してください。');
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setConvertedUrl(null);

    try {
      // 1. Create a new Image object and load the selected file
      const image = new Image();
      const imageUrl = URL.createObjectURL(selectedFile);
      image.src = imageUrl;

      image.onload = () => {
        // 2. Create an off-screen canvas
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas context could not be created.');
        }

        // 3. Draw the image onto the canvas
        ctx.drawImage(image, 0, 0);

        // 4. Convert the canvas content to the target format (as a Blob)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setConvertedUrl(url);
            } else {
              throw new Error('Image conversion failed.');
            }
            // Revoke the object URL to free up memory
            URL.revokeObjectURL(imageUrl);
            setIsLoading(false);
          },
          `image/${targetFormat}`,
          0.9 // For JPEGs, this is the quality (0.0 to 1.0)
        );
      };

      image.onerror = () => {
        setError('画像の読み込みに失敗しました。');
        setIsLoading(false);
        URL.revokeObjectURL(imageUrl);
      };

    } catch (err) {
      console.error(err);
      setError('画像の変換中に予期せぬエラーが発生しました。');
      setIsLoading(false);
    }
  };
  
  const getOutputFilename = () => {
    if (!selectedFile) return 'download';
    const name = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
    return `${name}.${targetFormat}`;
  };

  return (
    <div className={styles.container}>
      <h2>画像の拡張子変換ツール</h2>

      <div className={styles.uploadArea}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && !convertedUrl && <img src={preview} alt="Preview" className={styles.previewImage} />}
        {convertedUrl && <img src={convertedUrl} alt="Converted" className={styles.previewImage} />}
        {!preview && <p>ここにファイルをドラッグ＆ドロップするか、クリックして選択</p>}
      </div>
      
      {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

      {selectedFile && (
        <div className={styles.controls}>
          <select 
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value as 'jpeg' | 'png' | 'webp')}
            className={styles.select}
            disabled={isLoading}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
          <button onClick={handleConvert} className={styles.button} disabled={isLoading}>
            {isLoading ? '変換中...' : '変換する'}
          </button>
        </div>
      )}

      {convertedUrl && (
        <div className={styles.downloadArea}>
          <p>✅ 変換が完了しました！</p>
          <a href={convertedUrl} download={getOutputFilename()} className={styles.downloadLink}>
            画像をダウンロード
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;