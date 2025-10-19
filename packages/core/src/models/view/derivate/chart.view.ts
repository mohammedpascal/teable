import z from 'zod';
import type { IColumnMeta } from '../column-meta.schema';
import type { ViewType } from '../constant';
import { ViewCore } from '../view';
import type { IViewVo } from '../view.schema';

export interface IChartView extends IViewVo {
  type: ViewType.Chart;
  options: IChartViewOptions;
}

export type IChartViewOptions = z.infer<typeof chartViewOptionSchema>;

export const chartViewOptionSchema = z
  .object({
    config: z
      .object({
        type: z.enum(['bar', 'line', 'area', 'pie', 'table']),
        // Bar/Line/Area config
        xAxis: z
          .array(
            z.object({
              column: z.string(),
              display: z.union([
                z.object({
                  type: z.literal('bar'),
                  position: z.enum(['auto', 'left', 'right']).optional(),
                }),
                z.object({
                  type: z.enum(['line', 'area']),
                  position: z.enum(['auto', 'left', 'right']).optional(),
                  lineStyle: z.enum(['normal', 'linear', 'step']).optional(),
                }),
              ]),
            })
          )
          .optional(),
        xAxisDisplay: z
          .object({
            label: z.string().optional(),
          })
          .optional(),
        yAxis: z
          .array(
            z
              .object({
                column: z.string(),
                label: z.string().optional(),
                prefix: z.string().optional(),
                suffix: z.string().optional(),
                decimal: z.number().max(10).min(0).optional(),
              })
              .extend({
                display: z.union([
                  z.object({
                    type: z.literal('bar'),
                    position: z.enum(['auto', 'left', 'right']).optional(),
                  }),
                  z.object({
                    type: z.enum(['line', 'area']),
                    position: z.enum(['auto', 'left', 'right']).optional(),
                    lineStyle: z.enum(['normal', 'linear', 'step']).optional(),
                  }),
                ]),
              })
          )
          .optional(),
        yAxisDisplay: z
          .object({
            label: z.string().optional(),
            range: z
              .object({
                max: z.number().optional(),
                min: z.number().optional(),
              })
              .optional(),
          })
          .optional(),
        goalLine: z
          .object({
            enabled: z.boolean().optional(),
            value: z.number().optional(),
            label: z.string().optional(),
          })
          .optional(),
        showLabel: z.boolean().optional(),
        padding: z
          .object({
            top: z.number().optional(),
            right: z.number().optional(),
            bottom: z.number().optional(),
            left: z.number().optional(),
          })
          .optional(),
        // Bar-specific
        stack: z.boolean().optional(),
        // Pie-specific
        dimension: z.string().optional(),
        measure: z
          .object({
            column: z.string(),
            decimal: z.number().max(10).min(0).optional(),
            prefix: z.string().optional(),
            suffix: z.string().optional(),
          })
          .optional(),
        showTotal: z.boolean().optional(),
        showLegend: z.boolean().optional(),
        // Table-specific
        columns: z
          .array(
            z.object({
              column: z.string(),
              width: z.number().optional(),
              label: z.string().optional(),
              hidden: z.boolean().optional(),
            })
          )
          .optional(),
      })
      .optional(),
    query: z
      .object({
        filter: z.any().optional(),
        sort: z.any().optional(),
        group: z.any().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
      })
      .optional(),
  })
  .strict();

export class ChartViewCore extends ViewCore {
  type!: ViewType.Chart;

  options!: IChartViewOptions;

  columnMeta!: IColumnMeta;
}
