// src/api/pokemonDetail.ts
import type { FlavorTextEntry, Pokemon, PokemonAbility, PokemonStat, PokemonType } from './pokemon.type';
import type { Name } from './common.type';
import { API_BASE_URL } from '../config';

export class PokemonNotFoundError extends Error {
  constructor() {
    super('ポケモンが見つかりません');
    this.name = 'PokemonNotFoundError';
  }
}

type PokemonDetail = {
  id: number;
  number: number;
  name: string;
  japaneseName: string;
  image: string | null;
  types: string[];
  abilities: string[];
  description: string;
  baseStats: { name: string; value: number }[];
};

type PokemonSpeciesData = {
  id: number;
  names: Name[];
  flavor_text_entries: FlavorTextEntry[];
};

const findJapaneseName = (names: Name[], fallbackName: string): string => {
  const japaneseName = names.find((name) => name.language.name === 'ja-hrkt')
    ?? names.find((name) => name.language.name === 'ja');

  return japaneseName ? japaneseName.name : fallbackName;
};

export const fetchPokemonDetail = async (id: number): Promise<PokemonDetail> => {
  const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
  if (response.status === 404) {
    throw new PokemonNotFoundError();
  }
  if (!response.ok) {
    throw new Error('ポケモンの詳細情報の取得に失敗しました');
  }
  const data: Pokemon = await response.json();

  // ポケモン種族情報を取得して日本語名を取得
  const speciesResponse = await fetch(data.species.url);
  if (!speciesResponse.ok) {
    throw new Error('ポケモン種族情報の取得に失敗しました');
  }
  const speciesData: PokemonSpeciesData = await speciesResponse.json();
  const japaneseName = findJapaneseName(speciesData.names, data.name);

  // タイプの日本語名を取得
  const types = await Promise.all(
    data.types.map(async (typeInfo: PokemonType) => {
      const typeResponse = await fetch(typeInfo.type.url);
      if (!typeResponse.ok) {
        throw new Error('タイプ情報の取得に失敗しました');
      }
      const typeData: { names: Name[] } = await typeResponse.json();
      return findJapaneseName(typeData.names, typeInfo.type.name);
    })
  );

  // 特性の日本語名を取得
  const abilities = await Promise.all(
    data.abilities.map(async (abilityInfo: PokemonAbility) => {
      const abilityResponse = await fetch(abilityInfo.ability.url);
      if (!abilityResponse.ok) {
        throw new Error('特性情報の取得に失敗しました');
      }
      const abilityData: { names: Name[] } = await abilityResponse.json();
      return findJapaneseName(abilityData.names, abilityInfo.ability.name);
    })
  );

  // 種族値の取得
  const baseStats = await Promise.all(data.stats.map( async (stat: PokemonStat) => {
    // 日本語名を取得
    const japaneseStatData = await fetch(`${API_BASE_URL}/stat/${stat.stat.name}`);
    if (!japaneseStatData.ok) {
      throw new Error('種族値の取得に失敗しました');
    }
    const japaneseStatDataJson: { names: Name[] } = await japaneseStatData.json();
    return {
      name: findJapaneseName(japaneseStatDataJson.names, stat.stat.name),
      value: stat.base_stat,
    };
  }));

  // 説明文の取得
  const flavorTextEntry = speciesData.flavor_text_entries.find(
    (entry: FlavorTextEntry) => entry.language.name === 'ja'
  );
  const description = flavorTextEntry
    ? flavorTextEntry.flavor_text.replace(/\f/g, ' ')
    : '説明文がありません。';

  return {
    id: data.id,
    number: speciesData.id,
    name: data.name,
    japaneseName,
    image: data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default ?? null,
    types,
    abilities,
    description,
    baseStats,
  };
};
