
import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from '../../basic/error/error.utils';
import { WorldCupCoreErrorCode } from '../../basic/model/world-cup-core-error-code.enum';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { GroupApiItem, GroupsScreenModel, GroupTableModel } from './model/simulation-service.interface';

const GROUPS_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_GROUPS_UNAVAILABLE,
    message: 'No active world cup simulation found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_GROUPS_UNAVAILABLE,
    message: 'Groups data is not available right now.',
  },
};

const GROUPS_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_GROUPS_UNAVAILABLE,
  message: 'Unable to load groups data from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

@Injectable()
export class GroupsService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getGroups(lang?: string): Promise<GroupsScreenModel> {
    try {
      const resolvedLang = this.resolveLang(lang);
      const teamId = this.getCurrentTeamId();

      // Llamada 1: verificar que haya simulación activa
      await this.worldCupFeatureApiService.getCurrentWorldCup(resolvedLang);

      // Llamada 2: obtener los grupos
      const groupsRaw = await this.worldCupFeatureApiService.getGroups(resolvedLang) as GroupApiItem[];

      // Buscar en qué grupo está el equipo del usuario
      const userGroupId = this.findUserGroup(groupsRaw, teamId);

      // Transformar al modelo de respuesta
     return {
       groups: groupsRaw.map((g) => ({
         group: g.group,
          matchesPlayed: g.teams.reduce((sum, t) => sum + t.played, 0) / 2,
          hasBestThird: g.teams.some((t) => t.isBestThird),
          teams: g.teams.map((t) => ({
          ...t,
              goalDifferenceLabel: t.goalDifference > 0 ? `+${t.goalDifference}` : `${t.goalDifference}`,
              isSelectedTeam: t.teamId === teamId,
              qualificationBadge: t.isBestThird ? 'BEST_THIRD' : t.isQualified ? 'QUALIFIED' : 'NONE',
            })),
          })),
          userTeamId: teamId,
          userGroupId,
        };
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(error, GROUPS_API_ERROR_STATUS_MAP, GROUPS_API_ERROR_FALLBACK);
    }
  }

  private findUserGroup(groups: GroupApiItem[], teamId: string): string {
    for (const group of groups ?? []) {
      const found = group.teams.find((t) => t.teamId === teamId);
      if (found) return group.group;
    }
    return groups[0]?.group ?? 'A';
  }
}
