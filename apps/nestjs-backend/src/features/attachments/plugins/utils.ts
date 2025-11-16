import { join } from 'path';
import { baseConfig } from '../../../configs/base.config';
import { storageConfig } from '../../../configs/storage';
import { LocalStorage } from './local';
import type { ThumbnailSize } from './types';

export const getFullStorageUrl = (bucket: string, path: string) => {
  const { storagePrefix } = baseConfig();
  const { provider, s3 } = storageConfig();
  if (provider === 'local') {
    return baseConfig().storagePrefix + join('/', LocalStorage.readPath, bucket, path);
  }
  if (provider === 's3') {
    return `https://s3.${s3.region}.amazonaws.com/${bucket}/${path}`;
  }
  // For minio or other providers, use storagePrefix
  return storagePrefix + join('/', bucket, path);
};

export const generateCropImagePath = (path: string, size: ThumbnailSize) => {
  return `${path}_${size}`;
};
