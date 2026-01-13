/**
 * Get the backend base URL for HTTP requests
 * Uses the same hostname as the current page but with the backend port
 */
export function getBackendUrl(): string {
  const protocol = window.location.protocol;

  if (protocol === 'https:') {
    return 'https://tea.successta.com';
  }

  return `http://localhost:3000`;
}
