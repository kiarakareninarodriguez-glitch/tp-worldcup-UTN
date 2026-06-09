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
import { MatchSquadResponse } from 'src/match/services/model/api/match-squad-response.model';

@Injectable()
export class WorldCupFeatureApiService extends AbstractBaseService {
  constructor(
    worldCupApiService: WorldCupApiService,
    adminService: AdminService,
  ) {
    super(adminService, worldCupApiService);
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
    public async getMatchCurrentSquad(lang?: string): Promise<MatchSquadResponse> {
    return this.getEndpointData<MatchSquadResponse>('/match/current/squad', {
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
  /**
   * feature 10 jugar la final
   * 
    exist GET /world-cup/current - Para verificar si existe una final pendiente (canStartFinal,hasActiveFinal).
    crear GET /match/strategies - Para poblar el selector de estrategia. Acepta ?lang=
    crear GET /match/formations - Para poblar el selector de formación. Acepta ?lang=
    crear POST /match/select-strategy - Para cambiar la estrategia durante el partido.
    crear POST /match/start-final - Para iniciar la final. Body: { teamId: string }. Si ya hay un final activa, la retorna. El WorldCupCore pasa el teamId del .env (TEAM_ID).
    crear POST /match/play - Para ejecutar un turno. Body: { matchId: string, input?: string,messageTypeId?: string }. Retorna mensajes y opciones del proximo turno.
    crear POST /match/select-formation - Para cambiar la formación durante el partido
   * 
   */
  public async getStrategiesMatch(lang?: string): Promise<unknown> {
    return this.getEndpointData<unknown>('/match/strategies', {
      lang: this.resolveLang(lang),
    });
  }

  public async getFormationsMatch(lang?: string): Promise<unknown> {
    return this.getEndpointData<unknown>('/match/formations', {
      lang: this.resolveLang(lang),
    });
  }

  public async selectStrategyMatch(teamId: string,strategy: string, lang?: string): Promise<unknown> {
    return this.postEndpointData<unknown>('/match/select-strategy', {
      teamId,
      strategy,
      lang: this.resolveLang(lang),
    });
  }

  public async selectFormationMatch(teamId: string,formation: string, lang?: string): Promise<unknown> {
    return this.postEndpointData<unknown>('/match/select-formation', {
      teamId,
      formation,
      lang: this.resolveLang(lang),
    });
  }

  public async startFinalMatch(teamId: string, lang?: string): Promise<unknown> {
    return this.postEndpointData<unknown>('/match/start-final', {
      teamId,
      lang: this.resolveLang(lang),
    });
  }
  
  public async playMatch(matchId: string, input?: string,messageTypeId?: string, lang?: string): Promise<unknown> {
    return this.postEndpointData<unknown>('/match/play', {
      matchId,
      input,
      messageTypeId,
      lang: this.resolveLang(lang),
    });
  }
}
