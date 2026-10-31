// src/App.tsx（Headerだけを接続する段階）
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import PokemonList from './pages/PokemonList';
import PokemonDetail from './pages/PokemonDetail';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';



const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="*" element={
            <div className="p-4">
              <h2 className="text-xl">ページが見つかりません。</h2>
              <Link to="/" className="mt-3 inline-block text-blue-500 underline">一覧に戻る</Link>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
