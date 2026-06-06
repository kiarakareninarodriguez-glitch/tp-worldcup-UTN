import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { CurrentWorldCupQueryRequest } from './request/current-world-cup-query.request';
import { JourneyService } from '../services/journey.service';

@ApiTags('world-cup')
@Controller('world-cup')
export class JourneyController extends AbstractController {
  constructor(private readonly journeyService: JourneyService) {
    super();
  }

  @Get('journey')
  @ApiOperation({ summary: 'World Cup - Team journey through the tournament' })
  @ApiQuery({ name: 'lang', required: false, enum: ['es', 'en'] })
  public async getJourney(@Query() request: CurrentWorldCupQueryRequest): Promise<unknown> {
    return this.createOkResponse(await this.journeyService.getJourney(request.lang));
  }
}
