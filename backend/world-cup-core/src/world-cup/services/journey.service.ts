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
    return {
      worldCupId: raw.worldCupId ?? '',
      teamId: raw.teamId ?? '',
      teamName: raw.teamName ?? '',
      lang: raw.lang ?? 'es',
      worldCupStatus: raw.worldCupStatus ?? '',
      stageReached: raw.stageReached ?? '',
      stageReachedLabel: raw.stageReachedLabel ?? '',
      isChampion: raw.isChampion ?? false,
      isFinalPending: raw.isFinalPending ?? false,
      eliminatedByTeamId: raw.eliminatedByTeamId ?? null,
      eliminatedByTeamName: raw.eliminatedByTeamName ?? null,
      summary: raw.summary ?? '',
      matchesPlayed: raw.matchesPlayed ?? 0,
      matches: raw.matches ?? [],
    };
  }
}
