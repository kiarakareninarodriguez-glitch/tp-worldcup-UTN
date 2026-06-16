import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from '../../basic/error/error.utils';
import { WorldCupCoreErrorCode } from '../../basic/model/world-cup-core-error-code.enum';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { JourneyApiRawResponse, JourneyScreenModel } from './model/journey-service.interface';

const JOURNEY_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_JOURNEY_UNAVAILABLE,
    message: 'Journey data not found. Run simulation first.',
    statusCode: HttpStatus.CONFLICT,
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_JOURNEY_UNAVAILABLE,
    message: 'Journey data is not available. Run simulation first.',
    statusCode: HttpStatus.CONFLICT,
  },
};

const JOURNEY_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_JOURNEY_UNAVAILABLE,
  message: 'Unable to load journey data from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

@Injectable()
export class JourneyService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getJourney(lang?: string): Promise<JourneyScreenModel> {
    const resolvedLang = this.resolveLang(lang);

    try {
      const teamId = this.getCurrentTeamId();
      const raw = await this.worldCupFeatureApiService.getTeamJourney(teamId, resolvedLang);
      return this.buildJourneyModel(raw);
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(error, JOURNEY_API_ERROR_STATUS_MAP, JOURNEY_API_ERROR_FALLBACK);
    }
  }

  private buildJourneyModel(raw: JourneyApiRawResponse): JourneyScreenModel {
  const matches = (raw.matches ?? []).map((match) => ({
    stage: match.stage ?? '',
    stageLabel: this.resolveStageLabel(match.stage ?? ''),
    matchCode: match.matchCode ?? '',
    opponentTeamId: match.opponentTeamId ?? '',
    opponentTeamName: match.opponentTeamName ?? '',
    opponentFlag: '',
    goalsFor: match.goalsFor ?? null,
    goalsAgainst: match.goalsAgainst ?? null,
    scoreLabel: match.isPending ? '' : `${match.goalsFor} - ${match.goalsAgainst}`,
    result: match.result ?? '',
    resultLabel: this.resolveResultLabel(match.result ?? ''),
    resultStyle: (match.result ?? 'PENDING') as 'WIN' | 'LOSS' | 'DRAW' | 'PENDING',
    resolution: match.resolution ?? '',
    resolutionLabel: this.resolveResolutionLabel(match.resolution ?? ''),
    isPending: match.isPending ?? false,
  }));

  return {
    worldCupId: raw.worldCupId ?? '',
    teamId: raw.teamId ?? '',
    teamName: raw.teamName ?? '',
    lang: raw.lang ?? 'es',
    worldCupStatus: raw.worldCupStatus ?? '',
    stageReached: raw.stageReached ?? '',
    stageReachedLabel: this.resolveStageLabel(raw.stageReached ?? ''),
    isChampion: raw.isChampion ?? false,
    isFinalPending: raw.isFinalPending ?? false,
    eliminatedByTeamId: raw.eliminatedByTeamId ?? null,
    eliminatedByTeamName: raw.eliminatedByTeamName ?? null,
    summary: raw.summary ?? '',
    matchesPlayed: matches.filter((m) => !m.isPending).length,
    matches,
  };
}

private resolveStageLabel(stage: string): string {
  const map: Record<string, string> = {
    GROUP_STAGE: 'Fase de grupos',
    ROUND_OF_32: '32avos de final',
    ROUND_OF_16: 'Octavos de final',
    QUARTER_FINALS: 'Cuartos de final',
    SEMI_FINALS: 'Semifinal',
    FINAL: 'Final',
  };
  return map[stage] ?? stage;
}

private resolveResultLabel(result: string): string {
  const map: Record<string, string> = {
    WIN: 'Victoria',
    LOSS: 'Derrota',
    DRAW: 'Empate',
    PENDING: 'Pendiente',
  };
  return map[result] ?? result;
}

private resolveResolutionLabel(resolution: string): string {
  const map: Record<string, string> = {
    REGULAR_TIME: 'Tiempo reglamentario',
    EXTRA_TIME: 'Tiempo suplementario',
    PENALTIES: 'Penales',
    PENDING: 'Pendiente',
  };
  return map[resolution] ?? resolution;
}
}
