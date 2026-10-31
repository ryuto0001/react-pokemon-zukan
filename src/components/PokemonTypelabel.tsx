// src/components/PokemonTypeLabel.tsx
import React from 'react';
// ポケモンのタイプのラベル
import { pokemonTypesMap } from '../pokemonTypesMap';

type PokemonTypeLabelProps = {
  type: string;
};

// 提供する補助コード: 背景に合わせて読みやすい黒・白を選ぶ。
// 最初は入力が背景色、出力が文字色であることを確認する。
const getContrastingTextColor = (backgroundColor: string) => {
  const toLinear = (offset: number) => {
    const channel = parseInt(backgroundColor.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * toLinear(1) + 0.7152 * toLinear(3) + 0.0722 * toLinear(5);
  const blackContrast = (luminance + 0.05) / 0.05;
  const whiteContrast = 1.05 / (luminance + 0.05);
  return blackContrast >= whiteContrast ? '#000000' : '#ffffff';
};

const PokemonTypeLabel: React.FC<PokemonTypeLabelProps> = ({ type }) => {
  const typeInfo = pokemonTypesMap.find((t) => t.jaType === type || t.type === type);
  const backgroundColor = typeInfo?.color ?? '#6b7280';
  return (
    <span
      style={{
        backgroundColor,
        color: getContrastingTextColor(backgroundColor),
      }}
      key={type}
      className={`px-3 py-1 rounded-full w-fit`}
    >
      {typeInfo?.jaType ?? type}
    </span>
  );
};

export default PokemonTypeLabel;
