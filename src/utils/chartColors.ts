/**
 * Shared color palette for all charts
 * 10 distinct colors optimized for data visualization
 * Note: Red and pink colors excluded per user preference
 */

export const CHART_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Deep Orange
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#a78bfa', // Violet
] as const;

/**
 * Generate colors for a specific number of items
 * Repeats the palette if more colors are needed
 */
export function generateChartColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(CHART_COLORS[i % CHART_COLORS.length]);
  }
  return colors;
}

/**
 * Get a single color by index
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
