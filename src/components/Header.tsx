// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className="text-xl md:text-2xl">
        <Link to="/" className="inline-flex items-center gap-2 no-underline">
          <img
            src={logo}
            alt="モンスターボールのアイコン"
            className="w-8 h-8 md:w-10 md:h-10"
          />
          ポケモン図鑑
        </Link>
      </h1>
    </header>
  );
};

export default Header;
