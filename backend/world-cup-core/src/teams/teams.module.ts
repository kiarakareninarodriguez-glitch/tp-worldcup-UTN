import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { HttpModule } from '@nestjs/axios';
import { CoachingController } from './controllers/coaching.controller';
import { RivalsController } from './controllers/rivals.controller';
import { SquadController } from './controllers/squad.controller';
import { TeamHistoryController } from './controllers/team-history.controller';
import { CoachingService } from './services/coaching.service';
import { RivalsService } from './services/rivals.service';
import { SquadService } from './services/squad.service';
import { TeamHistoryService } from './services/team-history.service';
import { WorldCupApiService } from 'src/basic/world-cup-api.service';
import {BasicModule} from 'src/basic/basic.module';

@Module({
  imports: [AdminModule, HttpModule, BasicModule],
  controllers: [SquadController, CoachingController, TeamHistoryController, RivalsController],
  providers: [SquadService, CoachingService, TeamHistoryService, RivalsService, WorldCupApiService],
})
export class TeamsModule {}
