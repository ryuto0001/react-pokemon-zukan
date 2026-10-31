// src/api/pokemon.type.ts

import type { NamedAPIResource } from './common.type';

// ポケモンの画像データ
export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

// ポケモンのタイプ（くさ、ほのお、みず等）
export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

// ポケモンの特性（とくせい）
export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

// ポケモンのステータス（HP、攻撃、防御等）
export interface PokemonStat {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
}

// ポケモンの技
export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: VersionDetail[];
}

// その他の補助的な型
export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

export interface VersionDetail {
  rarity: number;
  version: NamedAPIResource;
}

export interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: VersionDetail[];
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
}
// src/api/pokemon.type.ts に続けて追加

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  game_indices: VersionGameIndex[];
  held_items: PokemonHeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];
  sprites: PokemonSprites;
  species: NamedAPIResource;
  stats: PokemonStat[];
  types: PokemonType[];
}
