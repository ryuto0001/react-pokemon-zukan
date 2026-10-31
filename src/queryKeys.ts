export const apiQueryKeys = {
  pokemon: {
    list: ['pokemon', 'list'] as const,
    index: ['pokemon', 'index'] as const,
    detail: (id: number) => ['pokemon', 'detail', id] as const,
  },
};
