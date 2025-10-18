import { z } from 'zod';

export enum GetTokenType {
  chart = 'chart',
}

export const getTokenRoSchema = z.object({
  baseId: z.string(),
  pluginId: z.string(),
  type: z.nativeEnum(GetTokenType),
});

export type IGetTokenRo = z.infer<typeof getTokenRoSchema>;

export const fetchGetToken = async (params: IGetTokenRo) => {
  const response = await fetch('/api/plugin/plugin/getToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get token: ${response.status} ${error}`);
  }

  return response.json();
};
