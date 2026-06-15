import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  combineLatest,
  finalize,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { CoachingViewModel } from '../model/coaching-view-model.interface';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { AdminService } from 'src/app/shared/admin/service/admin.service';
import { CoachingOverviewData } from '../model/coaching-api.interface';
import { AppContextService } from 'src/app/core/services/app-context.service';

@Injectable({ providedIn: 'root' })
export class CoachingService extends BaseApiService {
    private readonly adminService = inject(AdminService);
    protected override readonly appContextService = inject(AppContextService);

    private readonly pageState: CoachingViewModel = {
        lang: 'es',
        loading: false,
        savingStrategy: false,
        savingFormation: false,
        savingResetDefault: false,
        errorMessage: '',
        selectedTeamLabel: '',
        coach: null,
        strategy: null,
        formation: null,
        stats: null,
        strategies: [],
        formations: [],
        selectedStrategy: '',
        selectedFormation: '',
        selectedStrategyDescription: '',
        compatibleFormations: [],
        compatibleStrategies: [],
        baseRatings: [],
        effectiveRatings: [],
        ratingDeltas: [],
        strategyPenalty: 0,
        isSelectedFormationCompatible: true,
        tacticalStatusTone: 'original',
        tacticalStatusLabelKey: '',
    }

    private hasInitialized = false;
        

    getviewModel(): CoachingViewModel {
        return this.pageState;
    }

    initialize(): void {
    if (this.hasInitialized) {
      
      this.loadCoachingData().subscribe();
      return;
    }

    this.hasInitialized = true;
    this.pageState.lang = this.getCurrentLang();
    this.pageState.selectedTeamLabel = this.adminService.getCurrentTeam()?.name ?? 'SEN';

    this.adminService.currentTeam$.subscribe((team) => {
      this.pageState.selectedTeamLabel = team?.name ?? 'SEN';
    });

    combineLatest([
      this.appContextService.currentTeamId$, 
      this.appContextService.lang$
    ])
    .pipe(
      tap(([teamId, lang]) => {
        this.pageState.lang = lang === 'en' ? 'en' : 'es';
        this.pageState.selectedTeamLabel = teamId ? teamId.toUpperCase() : 'ARG';
      }),
      switchMap(() => this.loadCoachingData())
    )
    .subscribe();
    }

loadCoachingData(): Observable<void> {
    const lang = this.getCurrentLang();
    const teamId = this.getCurrentTeamId();

    this.pageState.loading = true;
    this.pageState.errorMessage = '';

    return this.get<CoachingOverviewData>('/my-team/coach', {
      lang,
    }).pipe(
      
      map((response) => response.data),
      tap((payload) => {
        if (!payload) return;

        this.pageState.coach = payload.coach;
        this.pageState.strategy = payload.strategy;
        this.pageState.formation = payload.formation;
        this.pageState.stats = payload.stats;
        this.pageState.strategies = payload.strategies ?? [];
        this.pageState.formations = payload.formations ?? [];
        
        this.pageState.selectedStrategy = payload.strategy?.strategy ?? '';
        this.pageState.selectedFormation = payload.formation?.formation ?? '';
        
        this.pageState.baseRatings = payload.baseRatings ?? [];
        this.pageState.effectiveRatings = payload.effectiveRatings ?? [];
        this.pageState.ratingDeltas = payload.ratingDeltas ?? [];
        this.pageState.strategyPenalty = payload.strategyPenalty ?? 0;

        if (payload.compatibility) {
          this.pageState.compatibleFormations = payload.compatibility.compatibleFormations ?? [];
          this.pageState.compatibleStrategies = payload.compatibility.compatibleStrategies ?? [];
          this.pageState.isSelectedFormationCompatible = payload.compatibility.isSelectedPairCompatible ?? true;
          this.pageState.tacticalStatusTone = payload.compatibility.isSelectedPairCompatible ? 'compatible' : 'incompatible';
        }
      }),
      
      map(() => undefined),
      catchError(() => {
        
        this.pageState.coach = null;
        this.pageState.stats = null;
        this.pageState.errorMessage = 'No se pudo recuperar la configuración del cuerpo técnico.';
        return of(undefined);
      }),
      
      finalize(() => {
        this.pageState.loading = false;
      })
    );
  }
}

    

