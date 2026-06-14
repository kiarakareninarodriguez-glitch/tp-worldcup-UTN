import { Injectable } from '@nestjs/common';
import { WorldCupFeatureApiService } from '../basic/world-cup-feature-api.service';

@Injectable()
export class LiveEventsService {

  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService
  ) {}

  async getLiveEvents(): Promise<any> {
    return this.worldCupFeatureApiService.getEndpointData(
      '/match/current/stats'
    );
  }
}