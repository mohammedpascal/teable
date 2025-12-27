/**
 * Transforms avatar path to full URL
 * Similar to backend getFullStorageUrl logic
 */
export function getFullAvatarUrl(avatar: string | null | undefined): string | null {
  if (!avatar) {
    return null;
  }

  // If already a full URL, return as-is
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  // Get storage prefix from environment
  const storagePrefix = process.env.STORAGE_PREFIX || process.env.NEXT_PUBLIC_STORAGE_PREFIX || '';

  if (!storagePrefix) {
    // If no storage prefix is configured, return the path as-is
    // This allows the frontend to handle it if needed
    return avatar;
  }

  // Construct full URL using storage prefix
  // Avatar bucket is typically 'public' for avatars
  const bucket = 'public';
  const path = avatar.startsWith('/') ? avatar.slice(1) : avatar;
  
  // Join storage prefix with bucket and path
  const separator = '/';
  const parts = [storagePrefix.replace(/\/$/, ''), bucket, path].filter(Boolean);
  return parts.join(separator);
}

