/**
 * Depth-based color utilities for EPI Brain
 * Converts depth scores (0.0-1.0) to color values
 */

export interface DepthColorConfig {
  fromColor: string;
  toColor: string;
  borderColor: string;
  textColor: string;
}

/**
 * Get background colors based on conversation depth
 * Depth ranges from 0.0 (surface) to 1.0 (profound)
 */
export function getDepthColors(depth: number | null): DepthColorConfig {
  if (depth === null) {
    // Default colors when depth is not enabled
    return {
      fromColor: '#1a0a2e',
      toColor: '#2d1b4e',
      borderColor: '#7B3FF2/20',
      textColor: '#ffffff',
    };
  }

  // Clamp depth to 0-1 range
  const clampedDepth = Math.max(0, Math.min(1, depth));

  // Color interpolation between light and dark purple
  // Light purple: #A78BFA (167, 139, 250)
  // Dark purple: #6B46C1 (107, 70, 193)
  
  const lightPurple = { r: 167, g: 139, b: 250 };
  const darkPurple = { r: 107, g: 70, b: 193 };
  
  const r = Math.round(lightPurple.r + (darkPurple.r - lightPurple.r) * clampedDepth);
  const g = Math.round(lightPurple.g + (darkPurple.g - lightPurple.g) * clampedDepth);
  const b = Math.round(lightPurple.b + (darkPurple.b - lightPurple.b) * clampedDepth);
  
  // Background gradient colors
  const fromColor = `rgb(${r}, ${g}, ${b})`;
  const toColor = `rgb(${Math.max(20, r - 50)}, ${Math.max(10, g - 30)}, ${Math.max(40, b - 30)})`;
  
  // Border color (lighter for shallow, darker for deep)
  const borderColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
  
  return {
    fromColor,
    toColor,
    borderColor,
    textColor: '#ffffff',
  };
}

/**
 * Get CSS gradient string based on depth
 */
export function getDepthGradient(depth: number | null): string {
  const colors = getDepthColors(depth);
  return `linear-gradient(to bottom right, ${colors.fromColor}, ${colors.toColor})`;
}

/**
 * Get depth level label
 */
export function getDepthLevel(depth: number): string {
  if (depth < 0.25) return 'Surface';
  if (depth < 0.5) return 'Shallow';
  if (depth < 0.75) return 'Deep';
  return 'Profound';
}

/**
 * Check if depth is profound (75%+)
 */
export function isProfound(depth: number): boolean {
  return depth >= 0.75;
}