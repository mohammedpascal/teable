/**
 * Converts a table name to a valid database table name format.
 * Similar to backend's convertNameToValidCharacter but adapted for frontend.
 * 
 * Rules:
 * - Convert to lowercase
 * - Replace spaces/special chars with underscores
 * - Ensure starts with letter (prefix 't' if needed)
 * - Limit to 40 characters
 */
export function convertTableNameToDbTableName(name: string): string {
  if (!name || name.trim() === '') {
    return 'unnamed';
  }

  // Convert to lowercase and replace spaces/special chars with underscores
  let cleanedName = name
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  // If empty or only underscores, return unnamed
  if (cleanedName === '' || /^_+$/.test(cleanedName)) {
    return 'unnamed';
  }

  // Ensure starts with letter (prefix 't' if needed)
  if (!/^[a-z]/.test(cleanedName)) {
    cleanedName = 't' + cleanedName;
  }

  // Limit to 40 characters (backend uses 40 for generateValidName)
  cleanedName = cleanedName.substring(0, 40);

  return cleanedName;
}

