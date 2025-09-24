import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public', // Service Workerファイルの出力先
  register: true, // Service Workerをブラウザに自動で登録する
  skipWaiting: true, // 新しいバージョンが有効化されるのを待たずにすぐにアクティベートする
  disable: process.env.NODE_ENV === 'development', // 開発環境ではPWAを無効にする
});

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig);
