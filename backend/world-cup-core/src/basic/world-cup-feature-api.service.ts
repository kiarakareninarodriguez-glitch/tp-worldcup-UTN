import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { AbstractBaseService } from './abstract-base.service';
import { LanguageEnum } from './model/language.enum';
import { WorldCupApiService } from './world-cup-api.service';
import type { GameDictionaryApiResponse, SquadPlayerApiItem } from '../teams/services/model/squad-service.interface';
import type { TeamHistoryApiResponse } from '../teams/services/model/team-history-service.interface';
import type { JourneyApiRawResponse } from '../world-cup/services/model/journey-service.interface';
import type {
  CurrentWorldCupApiResponse,
  TeamCatalogApiItem,
  TeamStatsApiResponse,
} from '../world-cup/services/model/simulation-service.interface';
import { WorldCupByIdApiResponse, WorldCupStatsByIdApiResponse, WorldCupAwardsByIdApiResponse, WorldCupMatchCardsApiResponse } from 'src/world-cup/services/model/world-cup-history-service.interface';
import { MatchStartFinalResponse, SelectStrategyResponse } from 'src/match/services/model/api/match-start-final-response.model';
import { MatchCurrentSquadResponse } from 'src/match/services/model/api/match-current-quad-response.model';
import { MatchStrategiesResponse } from 'src/match/services/model/api/match-strategies-response.mode';
import { MatchformationsResponse, SelectFormationResponse } from 'src/match/services/model/api/match-formations-response.mode';
import type { GroupApiItem } from '../world-cup/services/model/simulation-service.interface';
import { CoachingApiResponse, CoachingScreenResponse, CoachStatApiResponse } from 'src/teams/services/model/coaching-interface';

@Injectable()
export class WorldCupFeatureApiService extends AbstractBaseService {
 public async getGroups(lang?: string): Promise<GroupApiItem[]> {
  return this.getEndpointData<GroupApiItem[]>('/world-cup/current/groups', {
    lang: this.resolveLang(lang),
  });
}
  constructor(
    worldCupApiService: WorldCupApiService,
    adminService: AdminService,
  ) {
    super(adminService, worldCupApiService);
  }

  public async getCoach(teamId: string, lang?: string): Promise<CoachingApiResponse[]> {
    return this.getEndpointData<CoachingApiResponse[]>(`/teams/coaches/`, {
      teamId,
    });
  }

  public async getStats(teamId: string, lang?: string): Promise <CoachStatApiResponse> {

     return this.getEndpointData<CoachStatApiResponse>(`/teams/${teamId}/stats`, {
      lang: this.resolveLang(lang),
    });
  }

  public getCurrentTeamId(): string {
    return super.getCurrentTeamId();
  }

  public getCurrentLang(): LanguageEnum {
    return super.getCurrentLang();
  }

  public async getTeamPlayers(teamId: string, lang?: string): Promise<SquadPlayerApiItem[]> {
    return this.getEndpointData<SquadPlayerApiItem[]>(`/teams/${teamId}/players`, {
      lang: this.resolveLang(lang),
    });
  }

  public async getGameDictionary(lang?: string): Promise<GameDictionaryApiResponse> {
    return this.getEndpointData<GameDictionaryApiResponse>('/reference/game-dictionary', {
      lang: this.resolveLang(lang),
    });
  }

  public async getTeamHistory(teamId: string, lang?: string): Promise<TeamHistoryApiResponse> {
    return this.getEndpointData<TeamHistoryApiResponse>(`/teams/${teamId}/history`, {
      lang: this.resolveLang(lang),
    });
  }

  public async getTeamRivals(teamId: string): Promise<TeamCatalogApiItem[]> {
    return this.getEndpointData<TeamCatalogApiItem[]>(`/teams/${teamId}/rivals`);
  }

  public async listTeams(teamId?: string, name?: string): Promise<TeamCatalogApiItem[]> {
    return this.getEndpointData<TeamCatalogApiItem[]>('/teams', {
      teamId: teamId?.trim().toLowerCase(),
      name: name?.trim(),
    });
  }

  public async getTeamStats(teamId: string, lang?: string): Promise<TeamStatsApiResponse> {
    return this.getEndpointData<TeamStatsApiResponse>(`/teams/${teamId}/stats`, {
      lang: this.resolveLang(lang),
    });
  }

  public async getCurrentWorldCup(lang?: string): Promise<CurrentWorldCupApiResponse> {
    return this.getEndpointData<CurrentWorldCupApiResponse>('/world-cup/current', {
      lang: this.resolveLang(lang),
    });
  }
    public async getMatchCurrentSquad(lang?: string): Promise<MatchCurrentSquadResponse> {
    return this.getEndpointData<MatchCurrentSquadResponse>('/match/current/squad', {
      lang: this.resolveLang(lang),
    });
  }

  public async simulateWorldCup(teamId: string, lang?: string): Promise<CurrentWorldCupApiResponse> {
    return this.postEndpointData<CurrentWorldCupApiResponse>('/world-cup/simulate', {
      teamId,
      lang: this.resolveLang(lang),
    });
  }
  public async getTeamJourney(teamId: string, lang?: string): Promise<JourneyApiRawResponse> {
  return this.getEndpointData<JourneyApiRawResponse>(
    `/world-cup/current/teams/${teamId}/journey`,
    { lang: this.resolveLang(lang) },
  );
}
  public async getWorldCupHistory(): Promise<string[]> {
    return this.getEndpointData<string[]>('/world-cup/history');
  }

  public async getWorldCupById(id: string): Promise <WorldCupByIdApiResponse>{
    return this.getEndpointData<WorldCupByIdApiResponse>(`/world-cup/${id}`,{})
  }

  public async getWorldCupStatsById(id: string): Promise <WorldCupStatsByIdApiResponse>{
    return this.getEndpointData<WorldCupStatsByIdApiResponse>(`/world-cup/${id}/stats`,{})
  }

  public async getWorldCupAwardsById(id: string, lang?: string): Promise <WorldCupAwardsByIdApiResponse>{
    return this.getEndpointData<WorldCupAwardsByIdApiResponse>(`/world-cup/${id}/awards`,{
      lang: this.resolveLang(lang),
    })
  }

  public async getWorldCupMatchCardsById(id: string): Promise<WorldCupMatchCardsApiResponse[]> {
  return this.getEndpointData<WorldCupMatchCardsApiResponse[]>(`/world-cup/${id}/matches`, {});
}
 

  public async getStrategiesMatch(lang?: string): Promise<MatchStrategiesResponse[]> {
    return this.getEndpointData<MatchStrategiesResponse[]>('/match/strategies', {
      lang: this.resolveLang(lang),
    });
  }

  public async getFormationsMatch(lang?: string): Promise<MatchformationsResponse[]> {
    return this.getEndpointData<MatchformationsResponse[]>('/match/formations', {
      lang: this.resolveLang(lang),
    });
  }

  public async selectStrategyMatch(teamId: string,strategy: string, lang?: string): Promise<SelectStrategyResponse> {
    return this.postEndpointData<SelectStrategyResponse>('/match/select-strategy', {
      teamId,
      strategy,
      lang: this.resolveLang(lang),
    });
  }

  public async selectFormationMatch(teamId: string,formation: string, lang?: string): Promise<SelectFormationResponse> {
    return this.postEndpointData<SelectFormationResponse>('/match/select-formation', {
      teamId,
      formation,
      lang: this.resolveLang(lang),
    });
  }

  public async startFinalMatch(teamId: string, lang?: string): Promise<MatchStartFinalResponse> {
    return this.postEndpointData<MatchStartFinalResponse>('/match/start-final', {
      teamId,
      lang: this.resolveLang(lang),
    });
  }
  
  public async playMatch( selectedOption?: number, lang?: string): Promise<MatchStartFinalResponse> {
    return this.postEndpointData<MatchStartFinalResponse>('/match/play', {
      selectedOption,
      lang: this.resolveLang(lang),
    });
  }
}
