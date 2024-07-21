const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})
export function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value / 100)
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")
export function formatNumber(value: number) {
  return NUMBER_FORMATTER.format(value)
}

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
})
export function formatPercent(value: number) {
  return PERCENT_FORMATTER.format(value)
}
