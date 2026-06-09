import { inject, Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { UiVisualsService } from 'src/app/core/services/ui-visuals.service';
import { AdminService } from 'src/app/shared/admin/service/admin.service';
import { FinalChatViewModel } from '../model/final-chat-view-model.interface';

@Injectable({ providedIn: 'root' })
export class FinalChatService extends BaseApiService {
    private readonly adminService = inject(AdminService);
    private readonly uiVisualsService = inject(UiVisualsService);
    
    private readonly pageState: FinalChatViewModel = {
        lang: 'es',
        loading: false,
        starting: false,
        sending: false,
        errorMessage: '',
        actionErrorMessage: '',
        showNoFinalState: false,
        data: null,
        teamsPreview: null
    };
    
    initialize() {


    }
    getViewModel(): FinalChatViewModel {
      return this.pageState;
    }
}