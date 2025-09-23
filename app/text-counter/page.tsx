// app/text-counter/page.tsx
'use client';

import { useState } from 'react';
import styles from './page.module.css';

const TextCounter = () => {
  const [text, setText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  // Use a more robust regex for word count that handles Japanese and English
  const wordCount = (text.match(/[a-zA-Z0-9]+|[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g) || []).length;
  const charCount = text.length;
  const lineCount = text.split('\n').length;


  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>文字数カウンター</h2>
        <div 
          className={styles.helpIcon}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          ?
          {showTooltip && (
            <div className={styles.tooltip}>
              <h4>各項目の説明</h4>
              <p><strong>文字数:</strong> スペースや改行を含むすべての文字の総数です。</p>
              <p><strong>単語数:</strong> 英語はスペース区切り、日本語は文字ごとにカウントする簡易的な方法で計算しています。</p>
              <p><strong>行数:</strong> テキスト内の改行の数に基づいています。</p>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.results}>
        <div className={styles.resultItem}>
          <span className={styles.count}>{charCount}</span>
          <span className={styles.label}>文字</span>
        </div>
        <div className={styles.resultItem}>
          <span className={styles.count}>{wordCount}</span>
          <span className={styles.label}>単語</span>
        </div>
        <div className={styles.resultItem}>
          <span className={styles.count}>{lineCount}</span>
          <span className={styles.label}>行</span>
        </div>
      </div>

      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここにテキストを入力してください..."
      />
    </div>
  );
};

export default TextCounter;