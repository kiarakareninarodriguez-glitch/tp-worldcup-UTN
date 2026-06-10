import { Injectable } from '@nestjs/common';
import { WorldCupApiService } from '../../basic/world-cup-api.service';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from 'src/basic/abstract-base.service';
import { WorldCupFeatureApiService } from 'src/basic/world-cup-feature-api.service';

@Injectable()
export class CoachingService extends AbstractBaseService {
  private readonly teamId: string = process.env.TEAM_ID || 'SEN'; 

  constructor(private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
      adminService: AdminService,){
         super(adminService);
      }

    public async getCoachInfo(lang?: string): Promise<any> { 
      try {
        const resolvedLang = this.resolveLang(lang)
        const teamId = this.getCurrentTeamId()

        const coachResponse = await this.worldCupFeatureApiService.getCoach(teamId)
        return coachResponse; 


      }
        
      catch{

      }


    }
}