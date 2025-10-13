/* eslint-disable sonarjs/no-duplicate-string */
import { Controller, Get, Param, Query } from '@nestjs/common';
import type {
  IAggregationVo,
  ICalendarDailyCollectionVo,
  IGroupPointsVo,
  IRowCountVo,
  ISearchCountVo,
  ISearchIndexVo,
} from '@teable/openapi';
import {
  aggregationRoSchema,
  calendarDailyCollectionRoSchema,
  groupPointsRoSchema,
  IAggregationRo,
  IGroupPointsRo,
  IQueryBaseRo,
  searchCountRoSchema,
  ISearchCountRo,
  queryBaseSchema,
  ICalendarDailyCollectionRo,
  ISearchIndexByQueryRo,
  searchIndexByQueryRoSchema,
} from '@teable/openapi';
import { ZodValidationPipe } from '../../../zod.validation.pipe';
import { TqlPipe } from '../../record/open-api/tql.pipe';
import { AggregationOpenApiService } from './aggregation-open-api.service';

@Controller('api/table/:tableId/aggregation')
export class AggregationOpenApiController {
  constructor(private readonly aggregationOpenApiService: AggregationOpenApiService) {}

  @Get()
  async getAggregation(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(aggregationRoSchema), TqlPipe) query?: IAggregationRo
  ): Promise<IAggregationVo> {
    return await this.aggregationOpenApiService.getAggregation(tableId, query);
  }

  @Get('/row-count')
  async getRowCount(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(queryBaseSchema), TqlPipe) query?: IQueryBaseRo
  ): Promise<IRowCountVo> {
    return await this.aggregationOpenApiService.getRowCount(tableId, query);
  }

  @Get('/search-count')
  async getSearchCount(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(searchCountRoSchema), TqlPipe) query: ISearchCountRo
  ): Promise<ISearchCountVo> {
    return await this.aggregationOpenApiService.getSearchCount(tableId, query);
  }

  @Get('/search-index')
  async getRecordIndexBySearchOrder(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(searchIndexByQueryRoSchema), TqlPipe) query: ISearchIndexByQueryRo
  ): Promise<ISearchIndexVo> {
    return await this.aggregationOpenApiService.getRecordIndexBySearchOrder(tableId, query);
  }

  @Get('/group-points')
  async getGroupPoints(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(groupPointsRoSchema), TqlPipe) query?: IGroupPointsRo
  ): Promise<IGroupPointsVo> {
    return await this.aggregationOpenApiService.getGroupPoints(tableId, query);
  }

  @Get('/calendar-daily-collection')
  async getCalendarDailyCollection(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(calendarDailyCollectionRoSchema), TqlPipe)
    query: ICalendarDailyCollectionRo
  ): Promise<ICalendarDailyCollectionVo> {
    return await this.aggregationOpenApiService.getCalendarDailyCollection(tableId, query);
  }
}
