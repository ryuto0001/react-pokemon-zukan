// src/pages/PokemonList.tsx
import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiQueryKeys } from '../queryKeys';
import { fetchPokemonListWithJapaneseNames } from '../api/pokemonWithJapaneseName';
import type { PokemonWithJapaneseName } from '../api/pokemonWithJapaneseName';
import PokemonCard from '../components/PokemonCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { INITIAL_POKEMON_LIST_LIMIT } from '../config';

const PAGE_SIZE = INITIAL_POKEMON_LIST_LIMIT;

const PokemonList: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isFetching,
    status,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: apiQueryKeys.pokemon.list,
    queryFn: ({ pageParam = 0 }) => fetchPokemonListWithJapaneseNames(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length * PAGE_SIZE;
      }
      return undefined;
    },
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching && !isFetchNextPageError) {
          void fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isFetchNextPageError]);

  if (isLoading) return <PokemonListSkeleton />;
  if (status === 'error' && !data) {
    return (
      <div className="p-4">
        <p role="alert">ポケモン一覧を読み込めませんでした。接続を確認して、もう一度お試しください。</p>
        <button type="button" onClick={() => void refetch()} disabled={isFetching} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50">
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {status === 'error' && !isFetchNextPageError ? (
        <div className="mb-4">
          <p role="alert">一覧を更新できませんでした。前に読み込んだ内容を表示しています。</p>
          <button type="button" onClick={() => void refetch()} disabled={isFetching} className="mt-2 text-blue-500 underline disabled:opacity-50">
            再読み込み
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.pages.map((page) =>
          page.results.map((pokemon: PokemonWithJapaneseName) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))
        )}
      </div>
      <div ref={loadMoreRef} className="min-h-20 flex flex-col items-center justify-center gap-2 py-4">
        {isFetchingNextPage ? <Loader /> : isFetchNextPageError ? (
          <>
            <p role="alert">続きの読み込みに失敗しました。</p>
            <button type="button" onClick={() => void fetchNextPage()} disabled={isFetching} className="text-blue-500 underline disabled:opacity-50">
              続きを再読み込み
            </button>
          </>
        ) : hasNextPage ? (
          <button type="button" onClick={() => void fetchNextPage()} disabled={isFetching} className="text-blue-500 underline disabled:opacity-50">
            続きを読み込む
          </button>
        ) : null}
      </div>
    </div>
  );
};

// ローダーコンポーネント
const Loader: React.FC = () => (
  <div role="status" aria-label="読み込み中" className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
);

const PokemonListSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(18)].map((_, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4">
            <Skeleton height={120} />
            <Skeleton width={80} height={20} className="mt-2" />
            <Skeleton width={100} height={16} className="mt-1" />
          </div>
        ))}
      </div>
      <div className="h-10 flex items-center justify-center">
        <Skeleton width={100} height={20} />
      </div>
    </div>
  );
};

export default PokemonList;
