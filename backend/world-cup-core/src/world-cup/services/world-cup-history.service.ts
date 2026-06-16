import { HttpStatus, Injectable } from "@nestjs/common";
import { AdminService } from "src/admin/admin.service";
import { AbstractBaseService } from "src/basic/abstract-base.service";
import { WorldCupFeatureApiService } from "src/basic/world-cup-feature-api.service";
import { WorldCupHistoryItemModel, WorldCupHistoryScreenModel } from "./model/world-cup-history-service.model";
import { WorldCupAwardsByIdApiResponse, WorldCupByIdApiResponse, WorldCupMatchCardsApiResponse, WorldCupStatsByIdApiResponse } from "./model/world-cup-history-service.interface";
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
  const awards = await this.worldCupFeatureApiService.getWorldCupAwardsById(worldCupId);
  const CardsinMatches = await this.worldCupFeatureApiService.getWorldCupMatchCardsById(worldCupId);
  const worstFairPlay = this.findWorstFairPlayTeam(CardsinMatches);
  const historyItem = this.buildHistoryItem(worldCup, stats, awards, worstFairPlay);
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
 private buildHistoryItem(
  worldCup: WorldCupByIdApiResponse, 
  stats: WorldCupStatsByIdApiResponse,
  awards: WorldCupAwardsByIdApiResponse,
  worstFairPlay: { teamId: string; teamName: string; totalCards: number }
): WorldCupHistoryItemModel{
  const fairPlayAward = awards.find(award => award.code === 'FAIR_PLAY');
   return new WorldCupHistoryItemModel({
     worldCupId: worldCup.worldCupId, 
     finalPlayedAt: worldCup.updatedAt || null,
      edition: worldCup.edition,
      status: worldCup.status,
      champion: stats.champion ? { teamId: stats.champion.teamId, teamName: stats.champion.teamName } : { teamId: '', teamName: '' },
      runnerUp: stats.runnerUp ? { teamId: stats.runnerUp.teamId, teamName: stats.runnerUp.teamName } : { teamId: '', teamName: '' },
      thirdPlace: stats.thirdPlace ? { teamId: stats.thirdPlace.teamId, teamName: stats.thirdPlace.teamName } : { teamId: '', teamName: '' },
      fourthPlace: stats.fourthPlace ? { teamId: stats.fourthPlace.teamId, teamName: stats.fourthPlace.teamName } : { teamId: '', teamName: '' },
     fairPlay: fairPlayAward 
  ? { 
      teamId: fairPlayAward.teamId ?? '',
      teamName: fairPlayAward.teamName ?? '',
      teamFlag: '',
      fairPlayPoints: fairPlayAward.fairPlayPoints ?? 0,
      yellowCards: fairPlayAward.yellowCards ?? 0,
      redCards: fairPlayAward.redCards ?? 0,
      fairPlayRank: 1,
      totalRankedTeams: 0,
      hasData: true
    } 
  : { teamId: '', teamName: '', teamFlag: '', fairPlayPoints: 0, yellowCards: 0, redCards: 0, fairPlayRank: 0, totalRankedTeams: 0, hasData: false },
      totalMatches: stats.totalMatches || 0,
      totalGoals: stats.totalGoals || 0,
      avgGoalsPerMatch: stats.avgGoalsPerMatch || 0,
      yellowCards: stats.cards?.totalYellowCards || 0,
      redCards: stats.cards?.totalRedCards || 0,
      topScorer: stats.topScorers && stats.topScorers.length > 0 ? { playerName: stats.topScorers[0].playerName, teamId: stats.topScorers[0].teamId, teamName: stats.topScorers[0].teamName, value: stats.topScorers[0].value || 0 } : { playerName: '', teamId: '', teamName: '', value: 0 },
      topAssist: stats.topAssists && stats.topAssists.length > 0 ? { playerName: stats.topAssists[0].playerName, teamId: stats.topAssists[0].teamId, teamName: stats.topAssists[0].teamName, value: stats.topAssists[0].value || 0 } : { playerName: '', teamId: '', teamName: '', value: 0 },
      worstFairPlay: {
  teamId: worstFairPlay.teamId,
  teamName: worstFairPlay.teamName,
  teamFlag: '',
  fairPlayPoints: 0,
  yellowCards: 0,
  redCards: 0,
  fairPlayRank: 0,
  totalRankedTeams: 0,
  hasData: worstFairPlay.teamId !== '',
},
    }
  )
 }  
 private findWorstFairPlayTeam(matches: WorldCupMatchCardsApiResponse[]) {
  const cardsByTeam: Record<string, number> = {};
  const namesByTeam: Record<string, string> = {};

  matches.forEach(match => {
    cardsByTeam[match.homeTeamId] = (cardsByTeam[match.homeTeamId] ?? 0) + (match.homeTeamTotalYellowCards ?? 0) + (match.homeTeamTotalRedCards ?? 0);
    cardsByTeam[match.awayTeamId] = (cardsByTeam[match.awayTeamId] ?? 0) + (match.awayTeamTotalYellowCards ?? 0) + (match.awayTeamTotalRedCards ?? 0);
    namesByTeam[match.homeTeamId] = match.homeTeamName ?? '';
    namesByTeam[match.awayTeamId] = match.awayTeamName ?? '';
  }
)
let worstTeamId = '';
let maxCards = -1;

for (const teamId of Object.keys(cardsByTeam)) {
  if (cardsByTeam[teamId] > maxCards) {
    maxCards = cardsByTeam[teamId];
    worstTeamId = teamId;
  }
}

return {
  teamId: worstTeamId,
  teamName: namesByTeam[worstTeamId] ?? '',
  totalCards: maxCards,
};
 }
}

