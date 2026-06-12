import { Injectable } from "@nestjs/common";
import { identity } from "rxjs";
import { AdminService } from "src/admin/admin.service";
import { AbstractBaseService } from "src/basic/abstract-base.service";
import { WorldCupFeatureApiService } from "src/basic/world-cup-feature-api.service";

@Injectable()
export class WorldCupHistoryService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getWorldCupHistory(): Promise<unknown[]> {

    // TODO: manejar errores, cambiar los type: unknown
    
      const worldCupsIds: string[] = await this.worldCupFeatureApiService.getWorldCupHistory();

      const finishedWorldCupsIds = [];

      for  (const worldCupId of worldCupsIds) { 

        const worldCup = await this.worldCupFeatureApiService.getWorldCupById(worldCupId);

        if (worldCup.status === "ENDED") {
          finishedWorldCupsIds.push(worldCupId);
        }
       }
    const finishedWorldCupsStats  = [];

    for (const finishedWorldCupId of finishedWorldCupsIds){

      const worldCup = await this.worldCupFeatureApiService.getWorldCupStatsById(finishedWorldCupId)

      finishedWorldCupsStats.push(worldCup)
    }
    return finishedWorldCupsStats;
  }
} 

