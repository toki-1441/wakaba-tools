import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public', // Service Workerファイルの出力先
  register: true, // Service Workerをブラウザに自動で登録する
  skipWaiting: true, // 新しいバージョンが有効化されるのを待たずにすぐにアクティベートする
  disable: process.env.NODE_ENV === 'development', // 開発環境ではPWAを無効にする
  runtimeCaching: [
    // This is the crucial part.
    // It tells the service worker to ALWAYS fetch these files from the network (your server)
    // and not to try and cache them in a way that causes 404 errors.
    {
      urlPattern: /.*@mediapipe.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'mediapipe-cdn-cache',
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Add a rule for your locally served files as well
    {
      urlPattern: /\/(selfie_segmentation|selfie_segmentation_solution_simd_wasm_bin)\.(js|wasm|tflite|binarypb)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'mediapipe-local-files',
      },
    }
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig);
