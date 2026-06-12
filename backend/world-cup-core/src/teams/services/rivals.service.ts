import { Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';


interface RivalTeamCatalogItem {
  id?: string;
  name?: string;
  group?: string;
  footballAssociation?: string;
  rating?: number;
  coach?: string;
  captain?: string;
  strategy?: string;
  formation?: string;
}
@Injectable()
export class RivalsService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getRivals(lang?: string): Promise<unknown> {
    const teamId = this.getCurrentTeamId();
    const rivals = await this.worldCupFeatureApiService.getTeamRivals(teamId);

    const enrichedRivals = await Promise.all(
      rivals.map(async (rival: any) => {
        const teamData = await this.worldCupFeatureApiService.listTeams(rival.id);
        const team = teamData[0] as RivalTeamCatalogItem | undefined;

        return {
          id: rival.id,
          name: rival.name,
          confederation: team?.group ?? 'N/A',
          overallRating: team?.rating ?? 0,
          coachName: team?.coach ?? 'N/A',
          captainName: team?.captain ?? 'N/A',
          formation: team?.formation ?? 'N/A',
          strategy: team?.strategy ?? 'N/A',
        };
      }),
    );

    return {
      teamId,
      lang: lang ?? this.getCurrentLang(),
      totalRivals: enrichedRivals.length,
      rivals: enrichedRivals,
    };
  }
}