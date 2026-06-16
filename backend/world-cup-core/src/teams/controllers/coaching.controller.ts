import { Controller, Get, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoachingService } from '../services/coaching.service';
import { AbstractController } from 'src/basic/abstract.controller';
import { Body, Post } from '@nestjs/common';
import { FinalChatBodySelectFormation } from 'src/match/controllers/request/final-chat-query.request';
import { CoachingScreenResponse } from '../services/model/coaching-interface';
import { CoachingSelectFormation, CoachingSelectStrategy } from './request/coaching-query.request';

@ApiTags('my-team')
@Controller('my-team')
export class CoachingController extends AbstractController {

  constructor(private readonly coachingService: CoachingService) {
    super();
  }

  @Get('coach')
  @ApiOperation({ summary: 'Obtiene la información general del cuerpo técnico, tácticas y compatibilidad' })
  async getCoaching(
    @Query('lang') lang: string = 'es'
  ) {
    const coachData: CoachingScreenResponse = await this.coachingService.getCoachingOverview(lang);
    return this.createOkResponse(coachData);
  }

  @Post('select-strategy')
  @ApiOperation({ summary: 'Cuerpo técnico - Seleccionar estratégia' })
  public async selectStrategy(@Body() body: CoachingSelectStrategy): Promise<unknown> {
    return this.createOkResponse(await this.coachingService.selectStrategy(body.strategy, body.lang));
  }

  @Post('select-formation')
  @ApiOperation({ summary: 'Cuerpo técnico - seleccionar Formación' })
  public async selectformation(@Body() body: CoachingSelectFormation): Promise<unknown> {
    return this.createOkResponse(await this.coachingService.selectformation(body.formation, body.lang));
  }

}