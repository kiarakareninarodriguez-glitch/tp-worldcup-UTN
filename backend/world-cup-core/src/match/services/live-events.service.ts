import { Injectable } from '@nestjs/common';

@Injectable()
export class LiveEventsService {

  async getLiveEvents() {
    return {
      message: 'Live events funcionando 🚀',
      data: []
    };
  }
}