export const cleanFilters = <T extends Record<string, any>>(filters: T): T => {
  return Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
  ) as T;
}; 