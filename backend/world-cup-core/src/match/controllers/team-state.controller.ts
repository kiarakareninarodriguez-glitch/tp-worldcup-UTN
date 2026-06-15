import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from 'src/basic/abstract.controller';
import { TeamStateService } from '../services/team-state.service';
import { TeamStateQueryRequest } from './request/team-state-query.request';

@ApiTags('final-match')
@Controller('final-match')
export class TeamStateController extends AbstractController {

    constructor(private readonly teamStateService: TeamStateService) {
      super();
    }

      @Get('/team-state')
      @ApiOperation({ summary: 'final-match - Team status component' })
      @ApiQuery({ name: 'lang', required: false, enum: ['es', 'en'] })
      public async getTeamState(@Query() request: TeamStateQueryRequest): Promise<unknown> {

        return this.createOkResponse(await this.teamStateService.getTeamState(request.lang));
      }
}
