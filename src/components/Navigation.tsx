// src/components/Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bg-gray-100 p-4">
      <ul className="flex space-x-4">
        {/* 一覧画面の場合は一覧ボタンを非表示 */}
        {
          pathname !== '/' && (
            <li>
              <Link to="/" className="text-blue-500 hover:underline no-underline">{"< "}一覧</Link>
            </li>
          )
        }
        {/* 追加のナビゲーションリンクをここに記載 */}
      </ul>
    </nav>
  );
};

export default Navigation;

