import { HttpStatus, Injectable } from "@nestjs/common";
import { AdminService } from "src/admin/admin.service";
import { AbstractBaseService } from "src/basic/abstract-base.service";
import { WorldCupFeatureApiService } from "src/basic/world-cup-feature-api.service";
import { WorldCupHistoryItemModel, WorldCupHistoryScreenModel } from "./model/world-cup-history-service.model";
import { WorldCupByIdApiResponse, WorldCupStatsByIdApiResponse } from "./model/world-cup-history-service.interface";
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from "src/basic/error/error.utils";
import { WorldCupCoreErrorCode } from "src/basic/model/world-cup-core-error-code.enum";

const WORLD_CUP_HISTORY_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_WORLD_CUP_HISTORY_UNAVAILABLE,
    message: 'World cup history was not found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_WORLD_CUP_HISTORY_UNAVAILABLE,
    message: 'World cup history is not available right now. Try again in a moment.',
  },
};

const WORLD_CUP_HISTORY_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_WORLD_CUP_HISTORY_FETCH_FAILED,
  message: 'Unable to load world cup history from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

@Injectable()
export class WorldCupHistoryService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getWorldCupHistory(): Promise<WorldCupHistoryScreenModel> {
  try {
    const worldCupIds: string[] = await this.worldCupFeatureApiService.getWorldCupHistory();
    const historyItems: WorldCupHistoryItemModel[] = [];

    for (const worldCupId of worldCupIds) {
      const worldCup = await this.worldCupFeatureApiService.getWorldCupById(worldCupId);

      if (worldCup.status === 'ENDED') {
        const stats = await this.worldCupFeatureApiService.getWorldCupStatsById(worldCupId);
        const historyItem = this.buildHistoryItem(worldCup, stats);
        historyItems.push(historyItem);
      }
    }
    return new WorldCupHistoryScreenModel({
      teamId: this.getCurrentTeamId(),
      lang: this.resolveLang(),
      totalWorldCups: historyItems.length,
      worldCups: historyItems,
    });
 } catch (error) {
  ErrorUtils.mapWorldCupApiError(
    error,
    WORLD_CUP_HISTORY_API_ERROR_STATUS_MAP,
    WORLD_CUP_HISTORY_API_ERROR_FALLBACK,
  );
  }
}
 private buildHistoryItem(worldCup: WorldCupByIdApiResponse, stats : WorldCupStatsByIdApiResponse): WorldCupHistoryItemModel{
   return new WorldCupHistoryItemModel({
     worldCupId: worldCup.worldCupId,
      edition: worldCup.edition,
      finalPlayedAt: worldCup.updatedAt || null,
      champion: stats.champion ? { teamId: stats.champion.teamId, teamName: stats.champion.teamName } : { teamId: '', teamName: '' },
      runnerUp: stats.runnerUp ? { teamId: stats.runnerUp.teamId, teamName: stats.runnerUp.teamName } : { teamId: '', teamName: '' },
      thirdPlace: stats.thirdPlace ? { teamId: stats.thirdPlace.teamId, teamName: stats.thirdPlace.teamName } : { teamId: '', teamName: '' },
      fourthPlace: stats.fourthPlace ? { teamId: stats.fourthPlace.teamId, teamName: stats.fourthPlace.teamName } : { teamId: '', teamName: '' },
      totalMatches: stats.totalMatches || 0,
      totalGoals: stats.totalGoals || 0,
      avgGoalsPerMatch: stats.avgGoalsPerMatch || 0,
      yellowCards: stats.cards?.totalYellowCards || 0,
      redCards: stats.cards?.totalRedCards || 0,
      topScorer: stats.topScorers && stats.topScorers.length > 0 ? { playerName: stats.topScorers[0].playerName, teamId: stats.topScorers[0].teamId, teamName: stats.topScorers[0].teamName, value: stats.topScorers[0].value || 0 } : { playerName: '', teamId: '', teamName: '', value: 0 },
      topAssist: stats.topAssists && stats.topAssists.length > 0 ? { playerName: stats.topAssists[0].playerName, teamId: stats.topAssists[0].teamId, teamName: stats.topAssists[0].teamName, value: stats.topAssists[0].value || 0 } : { playerName: '', teamId: '', teamName: '', value: 0 },
   }
  )
 }  
} 

