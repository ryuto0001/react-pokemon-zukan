// src/api/pokemonWithJapaneseName.ts
import { INITIAL_POKEMON_LIST_LIMIT } from '../config';
import { fetchPokemonList } from './pokemon';
import type { PokemonListResult } from './pokemon';
import type { Pokemon } from './pokemon.type';
import { fetchPokemonJapaneseName } from './pokemonSpecies';

// ポケモンの日本語名を含む拡張情報を表す型
export type PokemonWithJapaneseName = {
  name: string;          // ポケモンの英語名
  url: string;           // ポケモンの詳細情報を取得するためのURL
  japaneseName: string;  // ポケモンの日本語名
  number: string;        // ポケモンの図鑑番号
  types: Pokemon['types'];       // タイプ情報
  abilities: Pokemon['abilities']; // 特性情報
};

// 日本語名を含むポケモンリストの結果を表す型
export type PokemonListWithJapaneseNames = {
  count: number;                         // 総ポケモン数
  next: string | null;                   // 次のページのURL（存在する場合）
  previous: string | null;               // 前のページのURL（存在する場合）
  results: PokemonWithJapaneseName[];    // ポケモンの詳細情報リスト
};

// 日本語名を含むポケモンリストを取得する関数
export const fetchPokemonListWithJapaneseNames = async (
  offset: number = 0,
  limit: number = INITIAL_POKEMON_LIST_LIMIT
): Promise<PokemonListWithJapaneseNames> => {
  // 1. 基本的なポケモンリストを取得
  const pokemonList: PokemonListResult = await fetchPokemonList(offset, limit);

  // 2. 各ポケモンの詳細情報を取得し、日本語名を追加
  const updatedResults: PokemonWithJapaneseName[] = await Promise.all(
    pokemonList.results.map(async (pokemon) => {
      // 2-1. ポケモンの詳細情報を取得
      const response = await fetch(pokemon.url);
      if (!response.ok) {
        throw new Error('ポケモンの詳細情報の取得に失敗しました');
      }
      const pokemonDetails: Pokemon = await response.json();

      // 2-2. 日本語名を取得
      const speciesUrl = pokemonDetails.species.url;
      const japaneseName = await fetchPokemonJapaneseName(speciesUrl, pokemon.name);

      // 2-3. 必要な情報を組み合わせて返す
      return {
        ...pokemon,
        japaneseName,
        number: speciesUrl.split('/').filter(Boolean).pop() ?? pokemonDetails.id.toString(),
        types: pokemonDetails.types,
        abilities: pokemonDetails.abilities
      };
    })
  );

  // 3. 元のリスト情報と更新された結果を組み合わせて返す
  return { ...pokemonList, results: updatedResults };
};
