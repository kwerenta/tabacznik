const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})
export function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value / 100)
}

const COMPACT_CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
})
export function formatCurrencyCompact(value: number) {
  return COMPACT_CURRENCY_FORMATTER.format(value / 100)
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")
export function formatNumber(value: number) {
  return NUMBER_FORMATTER.format(value)
}

const PROGRESS_FORMATTER = new Intl.NumberFormat("en-US", {
  signDisplay: "exceptZero",
})
export function formatNumberWithSign(value: number) {
  return PROGRESS_FORMATTER.format(value)
}

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
})
export function formatPercent(value: number) {
  return PERCENT_FORMATTER.format(value)
}
