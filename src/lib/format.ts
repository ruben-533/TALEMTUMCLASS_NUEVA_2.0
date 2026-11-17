/** Formatea valores en pesos colombianos sin decimales. */
export function formatCOP(value: number): string {
  return `$${value.toLocaleString('es-CO')}`
}

export function formatPrice(value: number): string {
  return `${formatCOP(value)} COP`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
