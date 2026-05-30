import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility: merge Tailwind classes safely.
 * Deduplicates conflicting Tailwind utilities (e.g. p-2 + p-4 → p-4).
 * Uses clsx for conditional class logic + twMerge for conflict resolution.
 *
 * Pattern: shadcn/ui convention (CA-5, react-tailwind-patterns skill).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
