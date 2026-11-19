import type { Customer } from './types'

export function filterCustomers(customers: readonly Customer[], search: string): Customer[] {
  const term = search.trim().toLowerCase()
  const digits = term.replace(/\D/g, '')
  return customers
    .filter(
      (customer) =>
        term === '' ||
        customer.name.toLowerCase().includes(term) ||
        (digits !== '' && customer.phone.replace(/\D/g, '').includes(digits)),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}
