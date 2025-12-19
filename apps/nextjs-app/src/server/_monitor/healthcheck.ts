export type IHealthCheckApiPayload = {
  status: 'ok' | 'error';
  message: string;
  appName: string;
  appVersion: string;
  timestamp: string;
};

export async function healthCheck() {
  const payload: IHealthCheckApiPayload = {
    status: 'ok',
    message: 'Health check successful for API route',
    appName: import.meta.env.VITE_APP_NAME ?? process.env.APP_NAME ?? 'unknown',
    appVersion: import.meta.env.VITE_APP_VERSION ?? process.env.APP_VERSION ?? 'unknown',
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(payload, undefined, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

