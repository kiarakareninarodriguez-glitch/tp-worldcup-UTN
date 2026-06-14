import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { LiveEventsService } from './live-events.service';

@Controller('final-match')
export class LiveEventsController {

  constructor(private readonly liveEventsService: LiveEventsService) {}

  @Get('live-events')
  @HttpCode(HttpStatus.OK)
  async getLiveEvents() {
    return await this.liveEventsService.getLiveEvents();
  }
}