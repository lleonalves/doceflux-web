import type { Product, ProductStatusFilter } from './types'

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

export function filterProducts(
  products: readonly Product[],
  search: string,
  status: ProductStatusFilter,
): Product[] {
  const term = normalize(search)
  return products
    .filter((product) => {
      if (status === 'active' && !product.active) return false
      if (status === 'inactive' && product.active) return false
      return term === '' || normalize(product.name).includes(term)
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}

export function countActive(products: readonly Product[]): number {
  return products.filter((product) => product.active).length
}
