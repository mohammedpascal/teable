/**
 * Get the backend base URL for HTTP requests
 * Uses the same hostname as the current page but with the backend port
 */
export function getBackendUrl(): string {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const backendPort = process.env.BACKEND_PORT || '3000';
  return `${protocol}//${hostname}:${backendPort}`;
}

