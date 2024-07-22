import { type ClassValue, clsx } from "clsx"
import { type SQL, sql } from "drizzle-orm"
import type { SQLiteColumn } from "drizzle-orm/sqlite-core"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateProgress(
  lastValue: number | undefined,
  previousValue: number | undefined,
) {
  return previousValue ? (lastValue ?? 0) / previousValue - 1 : lastValue ?? 0
}

export function getStatsQuery(
  dateColumn: SQLiteColumn,
  type: "last" | "previous",
  days: number,
  value: SQL<unknown> = sql.raw("1"),
) {
  const query = sql.empty()
  query
    .append(sql`CASE WHEN DATE(${dateColumn}, 'auto') `)
    .append(
      sql`>= DATE('now', '-${sql.raw(`${(type === "last" ? 1 : 2) * days}`)} days') `,
    )
  if (type === "previous")
    query.append(
      sql`AND DATE(${dateColumn}, 'auto') < DATE('now', '-${sql.raw(`${days}`)} days') `,
    )
  query.append(sql`THEN ${value} ELSE 0 END`)
  return query
}
