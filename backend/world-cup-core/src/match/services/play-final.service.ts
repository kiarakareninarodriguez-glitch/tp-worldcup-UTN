import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AbstractBaseService } from 'src/basic/abstract-base.service';
import { WorldCupFeatureApiService } from 'src/basic/world-cup-feature-api.service';
import { FinalChatApiResponse, FinalChatFormationCatalogApiItem, FinalChatMessageApiItem, FinalChatStrategyCatalogApiItem, FinalChatTeamsPreviewApiResponse } from './model/view/final-chat-api.interface';
import { LanguageEnum } from 'src/basic/model/language.enum';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from 'src/basic/error/error.utils';
import { WorldCupCoreErrorCode } from 'src/basic/model/world-cup-core-error-code.enum';
import { CurrentWorldCupApiResponse } from 'src/world-cup/services/model/simulation-service.interface';
import { MatchStartFinalResponse } from './model/api/match-start-final-response.model';
import { MatchStrategiesResponse } from './model/api/match-strategies-response.mode';
import { MatchStrategyLabels } from './model/api/match-strategy.enum';
import { MatchZoneLabels } from './model/api/match-zone.enum';
import { MatchformationsResponse } from './model/api/match-formations-response.mode';



const FINAL_CHAT_PREVIEW_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_FINAL_CHAT_PREVIEW_NOT_FOUND,
    message: 'Team state for the final was not found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_FINAL_CHAT_PREVIEW_UNAVAILABLE,
    message: 'Team state is not available right now. Try again in a moment.',
  },
};

const FINAL_CHAT_PREVIEW_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_FINAL_CHAT_PREVIEW_FETCH_FAILED,
  message: 'Unable to load team history from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};



@Injectable()
export class PlayFinalService extends AbstractBaseService {

  // TODO: Se debe implementar el controlador y el servicio correspondiente.

  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getPreview(lang?: string): Promise<FinalChatTeamsPreviewApiResponse> {

    try {

      const resolvedLang = this.resolveLang(lang);
      const matchCurrrent: CurrentWorldCupApiResponse = await this.worldCupFeatureApiService.getCurrentWorldCup(resolvedLang);

      return this.buildPreviewScreen(matchCurrrent, resolvedLang);
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(
        error,
        FINAL_CHAT_PREVIEW_API_ERROR_STATUS_MAP,
        FINAL_CHAT_PREVIEW_API_ERROR_FALLBACK,
      );
    }
  }

  buildPreviewScreen(matchCurrrentResponse: CurrentWorldCupApiResponse, resolvedLang: LanguageEnum): FinalChatTeamsPreviewApiResponse {

    const response: FinalChatTeamsPreviewApiResponse = {
      teamId: matchCurrrentResponse.finalHomeTeamId,
      opponentId: matchCurrrentResponse.finalAwayTeamId,
      teamName: matchCurrrentResponse.finalHomeTeamName,
      teamFlag: '',
      opponentName: matchCurrrentResponse.finalAwayTeamName,
      opponentFlag: '',
      worldCupStatus: matchCurrrentResponse.status,
      hasActiveFinal: matchCurrrentResponse.hasActiveFinal,
      canResimulate: matchCurrrentResponse.canResimulate,
      canStartFinal: matchCurrrentResponse.canStartFinal
    };

    return response;
  }

  public async play(option: number, lang: LanguageEnum): Promise<FinalChatApiResponse> {
    throw new Error('Method not implemented.');
  }
  public async start(lang: LanguageEnum): Promise<FinalChatApiResponse> {
    try {

      const teamId = this.getCurrentTeamId();
      const resolvedLang = this.resolveLang(lang);
      const matchCurrrent: MatchStartFinalResponse = await this.worldCupFeatureApiService.startFinalMatch(teamId, resolvedLang);
      const strategyCatalog: MatchStrategiesResponse[] = await this.worldCupFeatureApiService.getStrategiesMatch(resolvedLang);
      const formationCatalog: MatchformationsResponse[] = await this.worldCupFeatureApiService.getFormationsMatch(resolvedLang);

      return this.buildchatScreen(matchCurrrent, strategyCatalog, formationCatalog, resolvedLang);
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(
        error,
        FINAL_CHAT_PREVIEW_API_ERROR_STATUS_MAP,
        FINAL_CHAT_PREVIEW_API_ERROR_FALLBACK,
      );
    }
  }
  buildchatScreen(matchCurrrent: MatchStartFinalResponse, strategyCatalog: MatchStrategiesResponse[], formationCatalog: MatchformationsResponse[], resolvedLang: LanguageEnum): FinalChatApiResponse {

    const response: FinalChatApiResponse = {
      teamId: matchCurrrent.teamId,
      lang: this.getCurrentLang(),
      matchId: matchCurrrent.matchId,
      isFinished: matchCurrrent.isFinished,
      result: matchCurrrent.result,
      minute: matchCurrrent.minute,
      turn: matchCurrrent.turn,
      score: matchCurrrent.score,
      zone: matchCurrrent.zone,
      zoneLabel: MatchZoneLabels[matchCurrrent.zone],
      possession: matchCurrrent.possession,
      ballCarrier: matchCurrrent.ballCarrier,
      eventType: matchCurrrent.eventType,
      teamName: matchCurrrent.teamName,
      teamFlag: '',
      opponentName: matchCurrrent.opponentName,
      opponentFlag: '',
      teamCoachName: matchCurrrent.teamCoachName,
      teamCoachProfile: matchCurrrent.teamCoachProfile,
      teamStrategy: matchCurrrent.teamStrategy,
      teamStrategyLabel: MatchStrategyLabels[matchCurrrent.teamStrategy],
      teamFormation: matchCurrrent.teamFormation,
      opponentCoachName: matchCurrrent.opponentCoachName,
      opponentCoachProfile: matchCurrrent.opponentCoachProfile,
      opponentStrategy: matchCurrrent.opponentStrategy,
      opponentStrategyLabel: MatchStrategyLabels[matchCurrrent.opponentStrategy],
      opponentFormation: matchCurrrent.opponentFormation,
      options: matchCurrrent.options,
      canPlay: !matchCurrrent.isFinished,

      messageItems: matchCurrrent.messageItems.map(item => {
        return {
          type: item.type,
          text: item.text,
          minute: item.minute,
          turn: item.turn,
          teamId: item.teamId,
          teamName: item.teamName,
          playerName: item.playerName,
          bubbleRole: "user",
          icon: ""
        } as FinalChatMessageApiItem
      }),
      strategyCatalog: strategyCatalog.map((item) => {
        return {
          strategy: item.strategy,
          strategyLabel: MatchStrategyLabels[item.strategy],
          description: item.description
        } as FinalChatStrategyCatalogApiItem
      }),
      formationCatalog: formationCatalog.map((item) => {
        return {
          formation: item.formation,
          description: item.description
        } as FinalChatFormationCatalogApiItem
      }),//obtener por otro get
      onFieldSummary: []//
    };

    return response;
  }
}
