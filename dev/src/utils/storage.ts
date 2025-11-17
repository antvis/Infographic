/**
 * Utility for managing localStorage with validation and fallback logic
 */

/**
 * Get stored values from localStorage
 * @param key - The storage key
 * @param fallbackGetter - Function to get fallback value when stored value is invalid
 * @returns Stored values or null if not found/invalid
 */
export function getStoredValues<T extends Record<string, any>>(
  key: string,
  fallbackGetter?: (stored: T) => Partial<T>,
): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as T;

    // If fallback getter is provided, validate and merge with fallbacks
    if (fallbackGetter) {
      const fallbacks = fallbackGetter(parsed);
      return { ...parsed, ...fallbacks };
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Set values to localStorage
 * @param key - The storage key
 * @param values - Values to store
 */
export function setStoredValues(key: string, values: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Validate if a value exists in an array, return first item as fallback
 * @param value - Value to validate
 * @param validValues - Array of valid values
 * @returns Valid value or first item from validValues
 */
export function validateOrFallback<T>(
  value: T | undefined | null,
  validValues: T[],
): T {
  if (!value || !validValues.includes(value)) {
    return validValues[0];
  }
  return value;
}
