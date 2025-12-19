// Stub for openapi-snippet to prevent CommonJS require() errors in browser
// This module is server-only and should not be imported client-side

export const getEndpointSnippets = () => {
  console.warn('openapi-snippet is server-only and should not be used in the browser');
  return { snippets: [] };
};

export default {
  getEndpointSnippets,
};

