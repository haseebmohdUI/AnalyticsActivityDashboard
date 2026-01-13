/**
 * Shared color palette for all charts
 * Based on AHRI Visual Identity Guide
 * 10 distinct colors optimized for data visualization
 * Primary colors: AHRI Blue (#006daf) and AHRI Orange (#ee8815)
 */

export const CHART_COLORS = [
  '#006daf', // AHRI Blue (Primary)
  '#ee8815', // AHRI Orange (Primary)
  '#006a9f', // Contrast darker blue
  '#f8b146', // Contrast lighter orange
  '#006d6d', // Teal
  '#2a9d94', // Cyan-teal
  '#c1cd48', // Lime
  '#e16722', // Deep Orange
  '#00757d', // Dark Teal
  '#fcb15b', // Light Orange
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
