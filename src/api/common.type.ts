// src/api/common.type.ts

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface Name {
  name: string;
  language: NamedAPIResource;
}

export interface APIResource {
  url: string;
}
