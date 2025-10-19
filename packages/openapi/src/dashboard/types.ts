import { z } from '../zod';

export const dashboardLayoutSchema = z.array(
  z.object({
    widgetId: z.string(),
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
  })
);

export type IDashboardLayout = z.infer<typeof dashboardLayoutSchema>;

export const dashboardPluginItemSchema = z.object({
  id: z.string(),
  pluginInstallId: z.string(),
  name: z.string(),
  url: z.string().optional(),
});

export const dashboardWidgetItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  config: z.string().nullable(),
  position: z.string().nullable(),
});

export type IDashboardPluginItem = z.infer<typeof dashboardPluginItemSchema>;
export type IDashboardWidgetItem = z.infer<typeof dashboardWidgetItemSchema>;

export const pluginInstallStorageSchema = z.record(z.string(), z.unknown());

export type IPluginInstallStorage = z.infer<typeof pluginInstallStorageSchema>;
