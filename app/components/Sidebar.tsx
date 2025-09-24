// app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
  { name: '画像拡張子変換', path: '/image-converter' },
  { name: '画像リサイザー', path: '/image-resizer' },
  { name: '画像クロップ', path: '/image-cropper' }, 
  { name: '画像背景除去', path: '/background-remover' },
  { name: 'マジック透過ツール', path: '/magic-wand' },
  { name: '文字数カウンター', path: '/text-counter' },
  { name: 'QRコードジェネレーター', path: '/qrcode-generator' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link 
              href={item.path} 
              className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;