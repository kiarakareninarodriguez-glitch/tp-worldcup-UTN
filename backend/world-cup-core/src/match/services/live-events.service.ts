import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AbstractBaseService } from 'src/basic/abstract-base.service';
import { ErrorUtils } from 'src/basic/error/error.utils';
import { WorldCupApiService } from 'src/basic/world-cup-api.service';
import { WorldCupFeatureApiService } from 'src/basic/world-cup-feature-api.service';

@Injectable()
export class LiveEventsService extends AbstractBaseService {
  // TODO: Se debe implementar el controlador y el servicio correspondiente.

  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getLiveEvents(lang?: string): Promise<any> {

    try {

      const teamId = this.getCurrentTeamId();
      const resolvedLang = this.resolveLang(lang);
      const response: any = await this.worldCupFeatureApiService.getLiveEvents(resolvedLang);

      return response;
    } catch (error) {
      return null
    }

  }
}