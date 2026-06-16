import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LiveEventsService } from '../services/live-events.service';

@ApiTags('final-match')
@Controller('final-match')
export class LiveEventsController {

  constructor(private readonly liveEventsService: LiveEventsService) {}

  @Get('live-events')
  async getLiveEvents() {
    return await this.liveEventsService.getLiveEvents();
  }
}