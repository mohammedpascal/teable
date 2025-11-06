import { z } from '../zod';

export const getBaseItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const getBaseVoSchema = getBaseItemSchema;

export type IGetBaseVo = z.infer<typeof getBaseVoSchema>;
