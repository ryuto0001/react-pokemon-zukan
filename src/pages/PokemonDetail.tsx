// src/pages/PokemonDetail.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPokemonDetail, PokemonNotFoundError } from '../api/pokemonDetail';
import { fetchPokemonIndex } from '../api/pokemon';
import PokemonTypeLabel from '../components/PokemonTypelabel';
import { apiQueryKeys } from '../queryKeys';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pokemonId = Number(id);
  const isValidId = /^[1-9]\d*$/.test(id ?? '') && Number.isSafeInteger(pokemonId);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: apiQueryKeys.pokemon.detail(pokemonId),
    queryFn: () => fetchPokemonDetail(pokemonId),
    enabled: isValidId,
    retry: (failureCount, queryError) => !(queryError instanceof PokemonNotFoundError) && failureCount < 3,
  });

  const { data: pokemonIndex, isError: indexError, isFetching: isFetchingIndex, refetch: refetchIndex } = useQuery({
    queryKey: apiQueryKeys.pokemon.index,
    queryFn: fetchPokemonIndex,
    enabled: isValidId,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  const currentIndex = pokemonIndex?.findIndex((pokemon) =>
    Number(pokemon.url.split('/').filter(Boolean).pop()) === pokemonId
  ) ?? -1;
  const previousPokemon = currentIndex > 0 ? pokemonIndex?.[currentIndex - 1] : undefined;
  const nextPokemon = currentIndex >= 0 ? pokemonIndex?.[currentIndex + 1] : undefined;

  if (!isValidId) {
    return (
      <div className="p-4">
        <p role="alert">図鑑番号が正しくありません。</p>
        <Link to="/" className="mt-3 inline-block text-blue-500 underline">一覧に戻る</Link>
      </div>
    );
  }
  if (isLoading) return <PokemonDetailSkeleton />;
  if (!data) {
    const notFound = error instanceof PokemonNotFoundError;
    return (
      <div className="p-4">
        <p role="alert">{notFound ? 'ポケモンが見つかりません。' : 'ポケモンを読み込めませんでした。接続を確認して、もう一度お試しください。'}</p>
        <div className="mt-3 flex items-center gap-4">
          <Link to="/" className="text-blue-500 underline">一覧に戻る</Link>
          {!notFound ? (
            <button type="button" onClick={() => void refetch()} disabled={isFetching} className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50">
              再読み込み
            </button>
          ) : null}
        </div>
      </div>
    );
  }
  const totalStats = data.baseStats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <div className="p-4 max-w-100 m-auto">
      <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4">← 一覧に戻る</Link>
      {error ? (
        <div className="mt-4">
          <p role="alert">情報を更新できませんでした。前に読み込んだ内容を表示しています。</p>
          <button type="button" onClick={() => void refetch()} disabled={isFetching} className="mt-2 text-blue-500 underline disabled:opacity-50">
            再読み込み
          </button>
        </div>
      ) : null}
      <div className="mt-4 bg-white shadow-md rounded p-8 flex flex-col items-center gap-4">
        {data.image ? (
          <img src={data.image} alt={data.japaneseName} className="w-40 h-40" />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center text-gray-500">画像がありません</div>
        )}
        <h1 className="mt-4 text-2xl font-bold">{data.japaneseName} (#{data.number})</h1>
        <p className="mt-2 text-justify">{data.description}</p>
        <div className="grid grid-cols-2 gap-2">
          {data?.types?.map((type) => (
            <PokemonTypeLabel key={type} type={type} />
          ))}
        </div>
        <span className="w-fit whitespace-nowrap text-right">特性</span>
        <div className="flex gap-2">
          <div className="grid grid-cols-2 gap-2 w-full">
            {data?.abilities?.map((ability) => (
              <span key={ability}>{ability}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-x-2 w-full">
          {data?.baseStats?.map((stat) => (
            <div key={stat.name} className="flex items-center">
              <span className="w-24 text-right mr-2">{stat.name}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 rounded-full h-4"
                  style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 w-8">{stat.value}</span>
            </div>
          ))}
          {/* 合計種族値 */}
          <div className="flex items-center">
            <span className="w-24 text-right mr-2">合計</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 rounded-full h-4"
                style={{ width: `${Math.min((totalStats / 780) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="ml-2 w-8">{totalStats}</span>
          </div>
        </div>
      </div>
      {indexError && !pokemonIndex ? (
        <div className="mt-4">
          <p role="alert">前後のポケモンを確認できませんでした。</p>
          <button type="button" onClick={() => void refetchIndex()} disabled={isFetchingIndex} className="mt-2 text-blue-500 underline disabled:opacity-50">
            再読み込み
          </button>
        </div>
      ) : (
        <div className="mt-4 flex justify-between">
          {previousPokemon ? <Link to={`/pokemon/${previousPokemon.url.split('/').filter(Boolean).pop()}`} className="px-4 py-2 bg-blue-500 text-white rounded-md">前へ</Link> : <span />}
          {nextPokemon ? <Link to={`/pokemon/${nextPokemon.url.split('/').filter(Boolean).pop()}`} className="px-4 py-2 bg-blue-500 text-white rounded-md">次へ</Link> : null}
        </div>
      )}
    </div>
  );
};

const PokemonDetailSkeleton: React.FC = () => {
  return (
    <div className="p-4 max-w-100 m-auto">
      <div className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 w-24">
        <Skeleton />
      </div>
      <div className="mt-4 bg-white shadow-md rounded p-8 flex flex-col items-center gap-4">
        <Skeleton circle={true} width={160} height={160} />
        <Skeleton width={200} height={24} />
        <div className="w-full"><Skeleton height={60} /></div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-x-2 w-full">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton width={60} height={20} />
              <div className="flex-1 ml-2">
                <Skeleton height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton width={80} height={36} />
        <Skeleton width={80} height={36} />
      </div>
    </div>
  );
};

export default PokemonDetail;
