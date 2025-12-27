import { SsrApi } from '@/backend/api/rest/table.ssr';
import type { ISettingVo } from '@teable/openapi';

export async function getSettingServerData(): Promise<ISettingVo> {
  try {
    const ssrApi = new SsrApi();
    return await ssrApi.getSetting();
  } catch (error) {
    console.error('Failed to fetch setting data:', error);
    throw error; // Re-throw to let the loader handle it
  }
}

