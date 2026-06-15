import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AbstractBaseService } from 'src/basic/abstract-base.service';
import { WorldCupFeatureApiService } from 'src/basic/world-cup-feature-api.service';
import { LanguageEnum } from 'src/basic/model/language.enum';

import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from 'src/basic/error/error.utils';
import { WorldCupCoreErrorCode } from 'src/basic/model/world-cup-core-error-code.enum';
import { POSITIONS } from './helpers/reference.service';
import { TeamStateApiResponse, TeamStatePlayerApiItem, TeamStateTeamApiItem } from './model/view/team-state-api.interface';
import { MatchCurrentSquadItem, MatchCurrentSquadItemPlayer, MatchCurrentSquadResponse } from './model/api/match-current-quad-response.model';
import { MatchStrategyLabels } from './model/api/match-strategy.enum';


const TEAM_STATE_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_TEAM_STATE_NOT_FOUND,
    message: 'Team state for the final was not found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_TEAM_STATE_UNAVAILABLE,
    message: 'Team state is not available right now. Try again in a moment.',
  },
};

const TEAM_STATE_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_TEAM_STATE_FETCH_FAILED,
  message: 'Unable to load team history from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};


@Injectable()
export class TeamStateService extends AbstractBaseService {
  // TODO: Se debe implementar el controlador y el servicio correspondiente.

  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getTeamState(lang?: string): Promise<TeamStateApiResponse> {

    try {

      const teamId = this.getCurrentTeamId();
      const resolvedLang = this.resolveLang(lang);
      const teamState: MatchCurrentSquadResponse = await this.worldCupFeatureApiService.getMatchCurrentSquad(resolvedLang);

      return this.buildTeamStatenScreen(teamState, resolvedLang);
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(
        error,
        TEAM_STATE_API_ERROR_STATUS_MAP,
        TEAM_STATE_API_ERROR_FALLBACK,
      );
    }
  }

  private async buildTeamStatenScreen(
    teamState: MatchCurrentSquadResponse,
    lang: LanguageEnum,
  ): Promise<TeamStateApiResponse> {

    return {
      matchId: teamState.matchId,
      lang: lang,
      isActive: teamState.isActive,
      isFinished: teamState.isFinished,
      minute: teamState.minute,
      turn: teamState.turn,
      score: teamState.score,
      team: this.buildTeamStateItem(teamState.team, lang),
      opponent: this.buildTeamStateItem(teamState.opponent, lang),

    } as TeamStateApiResponse;
  }

  private buildTeamStateItem(teamData: MatchCurrentSquadItem, lang: LanguageEnum,): TeamStateTeamApiItem {

    return {
      id: teamData.id,
      name: teamData.name,
      formation: teamData.formation,
      strategy: teamData.strategy,
      coachName: teamData.coachName,
      coachProfile: teamData.coachProfile,
      maxSubstitutions: teamData.maxSubstitutions,
      substitutionsUsed: teamData.substitutionsUsed,
      remainingSubstitutions: teamData.remainingSubstitutions,
      onFieldCount: teamData.onFieldCount,
      flag: "",
      strategyLabel: MatchStrategyLabels[teamData.strategy], //teamData.strategy buscar mapa de descripciones
      tactical: {
        attack: teamData.tacticalBreakdown.effectiveTeamLine.attack,
        defense: teamData.tacticalBreakdown.effectiveTeamLine.defense,
        midfield: teamData.tacticalBreakdown.effectiveTeamLine.midfield
      },
      onField: this.buildTeamStatePlayerItemArray(teamData.onField, lang),
      bench: this.buildTeamStatePlayerItemArray(teamData.bench, lang),
    }

  }
  private buildTeamStatePlayerItemArray(teamStatePlayerItem: MatchCurrentSquadItemPlayer[], lang: LanguageEnum,): TeamStatePlayerApiItem[] {

    const players: TeamStatePlayerApiItem[] = teamStatePlayerItem.map((player) => ({
      playerId: player.playerId,
      name: player.name,
      shirtNumber: player.shirtNumber,
      position: player.position,
      age: player.age,
      energy: player.energy,
      isCaptain: player.isCaptain,
      isStarter: player.isStarter,
      isOnField: player.isOnField,
      yellowCards: player.yellowCards,
      redCard: player.redCard,
      isInjured: player.isInjured,
      positionTag: POSITIONS.find(posision => posision.code == player.position).label[lang],
      displayName: this.displayName(player.name),
      energyLabel: (player.energy > 70) ? "alto" : (player.energy > 40) ? "medio" : "bajo",//
      isBench: !player.isOnField,
    } as TeamStatePlayerApiItem));

    return players;

  }

  private displayName(playerName: string): string {
    const splitName=playerName.split(' ')
    if(splitName.length==1){
      return playerName.toUpperCase();
    } 

    const inicial = splitName[0].charAt(0).toUpperCase()
    const apellido = splitName[splitName.length - 1].toUpperCase();
    return `${inicial}. ${apellido}`;
  }
}


