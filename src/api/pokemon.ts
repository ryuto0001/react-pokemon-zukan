// src/api/pokemon.ts
import { API_BASE_URL } from '../config';

export interface PokemonListResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export const fetchPokemonList = async (offset: number = 0, limit: number = 20): Promise<PokemonListResult> => {
  const response = await fetch(`${API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('ポケモン一覧の取得に失敗しました');
  }
  const data = await response.json();
  return data;
};

export const fetchPokemonIndex = async (): Promise<PokemonListResult['results']> => {
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=2000&offset=0`);
  if (!response.ok) {
    throw new Error('ポケモン一覧の取得に失敗しました');
  }
  const data: PokemonListResult = await response.json();
  return data.results;
};
