export function isPrintableValue(value: unknown): boolean {
  // Check for primitive types
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }

  // Check for specific object types that are considered "printable"
  if (value instanceof Date) {
    return true;
  }

  // Exclude null and generic objects
  if (
    value === null ||
    (typeof value === 'object' && value.constructor === Object)
  ) {
    return false;
  }

  // You might add more specific checks here for other "printable" object types if needed.

  return false; // Default for other unhandled types
}
