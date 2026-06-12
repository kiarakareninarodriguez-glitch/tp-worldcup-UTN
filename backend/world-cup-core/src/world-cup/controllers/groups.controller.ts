
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from 'src/basic/abstract.controller';
import { CurrentWorldCupQueryRequest } from './request/current-world-cup-query.request';
import { GroupsService } from '../services/groups.service';

@ApiTags('world-cup')
@Controller('world-cup')
export class GroupsController extends AbstractController {
  constructor(private readonly groupsService: GroupsService) {
    super();
  }

  @Get('groups')
  @ApiOperation({ summary: 'World Cup - Fase de Grupos' })
  @ApiQuery({ name: 'lang', required: false, enum: ['es', 'en'] })
  public async getGroups(@Query() request: CurrentWorldCupQueryRequest): Promise<unknown> {
    return this.createOkResponse(
      await this.groupsService.getGroups(request.lang),
    );
  }
}
