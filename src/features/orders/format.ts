const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// A API envia Instant em UTC; sem timeZone fixo o Intl exibe no fuso do navegador.
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date)
}
