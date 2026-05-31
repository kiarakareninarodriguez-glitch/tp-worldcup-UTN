import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from 'src/basic/abstract.controller';
import { TeamStateQueryRequest } from './request/team-state-query.request';
import { TeamStateApiResponse } from '../services/model/view/team-state-api.interface';

@ApiTags('final-match')
@Controller('final-match')
export class TeamStateController extends AbstractController {
  // TODO: Se debe implementar el controlador y el servicio correspondiente.

    constructor() {
      super();
    }

      /** Returns title team state. */
      @Get('/final-match/team-state')
      @ApiOperation({ summary: 'final-match - Team status component' })
      @ApiQuery({ name: 'lang', required: false, enum: ['es', 'en'] })
      public async getTeamState(@Query() request: TeamStateQueryRequest): Promise<unknown> {

        return this.createOkResponse({} as TeamStateApiResponse);
      }
}
