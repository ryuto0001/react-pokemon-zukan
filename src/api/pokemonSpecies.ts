// src/api/pokemonSpecies.ts
type SpeciesName = {
  name: string;
  language: {
    name: string;
    url: string;
  };
};

type SpeciesData = {
  names: SpeciesName[];
};

export const fetchPokemonJapaneseName = async (
  speciesUrl: string,
  fallbackName: string
): Promise<string> => {
  try {
    const response = await fetch(speciesUrl);
    if (!response.ok) {
      throw new Error('ポケモン種族情報の取得に失敗しました');
    }
    const data: SpeciesData = await response.json();
    const japaneseNameEntry = data.names.find((nameEntry) => nameEntry.language.name === 'ja-hrkt')
      ?? data.names.find((nameEntry) => nameEntry.language.name === 'ja');
    return japaneseNameEntry ? japaneseNameEntry.name : fallbackName;
  } catch (error) {
    console.error('ポケモン種族情報の取得に失敗しました', error);
    return fallbackName;
  }
};
