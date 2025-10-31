/**
 * Responsive breakpoint constants
 * Used throughout the application for consistent responsive behavior
 */

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Media query strings for use in CSS
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  tabletAndDown: `(max-width: ${BREAKPOINTS.desktop - 1}px)`,
  tabletAndUp: `(min-width: ${BREAKPOINTS.tablet}px)`,
} as const;
