import { Controller, Get, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoachingService } from '../services/coaching.service';
import { AbstractController } from 'src/basic/abstract.controller';

@ApiTags('my-team') 
@Controller('my-team') 
export class CoachingController extends AbstractController {
  
  constructor(private readonly coachingService: CoachingService) {
    super();
  }

  @Get('coaching')
  @HttpCode(HttpStatus.OK) 
  async getCoaching(
    @Query('teamId') teamId: string, 
    @Query('lang') lang: string = 'es' 
  ) {
    
    return await this.coachingService.getCoachingOverview(teamId, lang);
  }
}