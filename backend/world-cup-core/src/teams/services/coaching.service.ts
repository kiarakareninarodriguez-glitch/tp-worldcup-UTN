import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AbstractBaseService } from 'src/basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from 'src/basic/error/error.utils';
import { LanguageEnum } from 'src/basic/model/language.enum';
import { WorldCupCoreErrorCode } from 'src/basic/model/world-cup-core-error-code.enum';
import { WorldCupApiService } from 'src/basic/world-cup-api.service';
import { MatchformationsResponse, SelectFormationResponse } from 'src/match/services/model/api/match-formations-response.mode';
import { SelectStrategyResponse } from 'src/match/services/model/api/match-start-final-response.model';
import { MatchStrategyLabels } from 'src/match/services/model/api/match-strategy.enum';
import { WorldCupFeatureApiService } from 'src/basic/world-cup-feature-api.service';
import { CoachingResponse, CoachingApiResponse, CoachingScreenResponse, CoachStrategyCatalogApiItem, CoachFormationCatalogApiItem, CoachStatApiResponse, CoachingCoach } from './model/coaching-interface';
import { CoachProfile } from './model/api/coach-profile.enum';
import { MatchStrategiesResponse } from 'src/match/services/model/api/match-strategies-response.mode';



const COACHING_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_COACHING_NOT_FOUND,
    message: 'No se encontró el cuerpo técnico en el sistema central para el equipo seleccionado.',
    statusCode: HttpStatus.NOT_FOUND,
  },
};

const COACHING_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_COACH_UNAVAILABLE,
  message: 'No se pudo cargar la información de coaching desde la World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

@Injectable()
export class CoachingService extends AbstractBaseService {

  constructor(
    protected readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }



  public async getCoachingOverview(lang?: string): Promise<CoachingScreenResponse> {
    try {

      const teamId = this.getCurrentTeamId();
      const resolvedLang = this.resolveLang(lang);
      const strategyCatalog: MatchStrategiesResponse[] = await this.worldCupFeatureApiService.getStrategiesMatch(resolvedLang);
      const formationCatalog: MatchformationsResponse[] = await this.worldCupFeatureApiService.getFormationsMatch(resolvedLang);
      //const currentStrategy = this.getCoachingStrategy();

      const coachesData: CoachingApiResponse[] = await this.worldCupFeatureApiService.getCoach(teamId, lang);
      const coachStats: CoachStatApiResponse = await this.worldCupFeatureApiService.getStats(teamId, lang);
      const coachData = coachesData[0] 


      /*if (!coachData) {
        throw { status: HttpStatus.NOT_FOUND };
      }*/

      const response = {
        coachA: {
          coachId: coachData.coachId,
          teamId: coachData.teamId,
          teamName: coachData.teamName,
          name: coachData.name,
          age: coachData.age,
          nationality: coachData.nationality,
          profile: coachData.profile,
          riskAppetite: coachData.riskAppetite,
          gameManagement: coachData.gameManagement,
          adaptability: coachData.adaptability,
          pressingBias: coachData.pressingBias,
          possessionBias: coachData.possessionBias,
          defenseBias: coachData.defenseBias,
          maxStrategyChanges: coachData.maxStrategyChanges
        },
        stats: {
          attack: coachStats.attack,
          defense: coachStats.defense,
          midfield: coachStats.midfield,
          overall: coachStats.overall,
          current_strategy: coachStats.current_strategy,
          current_formation: coachStats.current_formation
        },
        strategys: strategyCatalog.map((item) => {
          return {
            strategy: item.strategy,
            strategyLabel: MatchStrategyLabels[item.strategy],
            description: item.description
          } as CoachStrategyCatalogApiItem
        }),
        formations: formationCatalog.map((item) => {
          return {
            formation: item.formation,
            description: item.description
          } as CoachFormationCatalogApiItem
        }),


       } as CoachingScreenResponse;

      return response

    } catch (error) {
      ErrorUtils.mapWorldCupApiError(
        error,
        COACHING_API_ERROR_STATUS_MAP,
        COACHING_API_ERROR_FALLBACK,
      );
    }

  }

  /*public async getCoachingStrategy(lang?: string): Promise<CoachingResponse> {
    const Strategy =this.;
    return {
      teamId: this.getCurrentTeamId(),
      strategy: this. , 
    }
  }*/


  public async selectformation(formation: string, lang: LanguageEnum): Promise<SelectFormationResponse> {
    try {

      const teamId = this.getCurrentTeamId();
      const resolvedLang = this.resolveLang(lang);
      const selectFormationResponse: SelectFormationResponse = await this.worldCupFeatureApiService.selectFormationMatch(teamId, formation, resolvedLang)

      return selectFormationResponse;
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(
        error,
        COACHING_API_ERROR_STATUS_MAP,
        COACHING_API_ERROR_FALLBACK,
      );
    }
  }

  public async selectStrategy(strategy: string, lang: LanguageEnum): Promise<SelectStrategyResponse> {
    try {

      const teamId = this.getCurrentTeamId();
      const resolvedLang = this.resolveLang(lang);
      console.log(teamId, strategy, resolvedLang)
      const selectStrategyResponse: SelectStrategyResponse = await this.worldCupFeatureApiService.selectStrategyMatch(teamId, strategy, resolvedLang);

      selectStrategyResponse.strategyLabel = MatchStrategyLabels[selectStrategyResponse.strategy];

      return selectStrategyResponse;
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(
        error,
        COACHING_API_ERROR_STATUS_MAP,
        COACHING_API_ERROR_FALLBACK,
      );
    }
  }


}






/* selectStrategy(strategy: string, lang?: string): any {
  const resolvedLang = this.resolveLang(lang);
  const strategyName = strategy === "" ? (resolvedLang === LanguageEnum.ES ? "Contraataque" : "Counter-Attack") : strategy;
  return {
    teamId: this.getCurrentTeamId(),
    strategy,
    message: resolvedLang === LanguageEnum.ES ? `Estrategia cambiada a ${strategyName}` : `Strategy changed to ${strategyName}`
  };
}
}*/