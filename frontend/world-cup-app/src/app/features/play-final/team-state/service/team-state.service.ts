import { HttpErrorResponse } from '@angular/common/http';
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
import { BaseApiService } from '../../../../core/services/base-api.service';
import { UiVisualsService } from '../../../../core/services/ui-visuals.service';
import { TeamStateApiResponse } from '../model/team-state-api.interface';
import { TeamStateViewModel } from '../model/team-state-view-model.interface';
@Injectable({ providedIn: 'root' })
export class TeamStateService  extends BaseApiService {
  private readonly uiVisualsService = inject(UiVisualsService);

  private readonly pageState: TeamStateViewModel = {
    lang: 'es',
    loading: false,
    errorMessage: '',
    showNoFinalState: false,
    data: null,
  };
    private hasInitialized = false;

  getViewModel(): TeamStateViewModel {
    return this.pageState;
  }
  initialize(): void {
    if (this.hasInitialized) {
      this.loadCurrentTeamState().subscribe();
      return;
    }

    this.hasInitialized = true;
    this.pageState.lang = this.getCurrentLang();

    combineLatest([
      this.appContextService.currentTeamId$,
      this.appContextService.lang$,
      this.appContextService.worldCupRefresh$,
    ])
      .pipe(
        tap(([, lang]) => (this.pageState.lang = lang === 'en' ? 'en' : 'es')),
        switchMap(() => this.loadCurrentTeamState()),
      )
      .subscribe();
  }

  private loadCurrentTeamState(): Observable<void> {
      const lang = this.getCurrentLang();
      this.pageState.lang = lang;
      this.pageState.loading = true;
      this.pageState.errorMessage = '';
  
      return this.get<TeamStateApiResponse>('/final-match/team-state', { lang })
      .pipe(
        map((response) => response.data),
        map((teamState) => this.normalizeTeamState(teamState)),
        tap((teamState) => (this.pageState.data = teamState)),
        tap(() => (this.pageState.showNoFinalState = false)),
        map(() => undefined),
        catchError((error: HttpErrorResponse) => {
          if (this.isMatchUnavailableError(error)) {
            this.pageState.data = null;
            this.pageState.showNoFinalState = true;
            this.pageState.errorMessage = '';
            return of(undefined);
          }
  
          this.pageState.data = null;
          this.pageState.showNoFinalState = true;
          this.pageState.errorMessage = 'No se pudieron cargar los datos de la final.';
          return of(undefined);
        }),
        finalize(() => (this.pageState.loading = false)),
      );
    }

     private normalizeTeamState(
        teamState: TeamStateApiResponse | null | undefined,
      ): TeamStateApiResponse | null {
        if (!teamState) {
          return null;
        }
    
        return {
          ...teamState,
          team: {
            ...teamState.team,
            flag: this.uiVisualsService.getTeamFlag(teamState.team?.id),
          },
          opponent: {
            ...teamState.opponent,
            flag: this.uiVisualsService.getTeamFlag(teamState.opponent?.id),
          },
        };
      }

    private isMatchUnavailableError(error: HttpErrorResponse): boolean {
        const messageCode = (error?.error as { responseMessage?: { messageCode?: string } } | undefined)
        ?.responseMessage?.messageCode;

        return messageCode === 'WC_TEAM_STATE_UNAVAILABLE';
    }
}
