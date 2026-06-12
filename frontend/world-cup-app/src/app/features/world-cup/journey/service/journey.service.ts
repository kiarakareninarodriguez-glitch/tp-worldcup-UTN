import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { JourneyApiResponse } from '../model/journey-api.interface';
import { JourneyViewModel } from '../model/journey-view-model.interface';

@Injectable({ providedIn: 'root' })
export class JourneyService extends BaseApiService {
  private readonly pageState: JourneyViewModel = {
    lang: 'es',
    loading: false,
    errorMessage: '',
    showNoSimulationState: false,
    selectedTeamLabel: '',
    journey: null,
  };

  getViewModel(): JourneyViewModel {
    return this.pageState;
  }

  initialize(): void {
    this.appContextService.worldCupRefresh$
      .pipe(switchMap(() => this.loadJourney()))
      .subscribe();
  }

  private loadJourney() {
    const lang = this.getCurrentLang();
    this.pageState.lang = lang;
    this.pageState.loading = true;
    this.pageState.errorMessage = '';
    this.pageState.showNoSimulationState = false;

    return this.get<JourneyApiResponse>('/world-cup/journey', { lang }).pipe(
      tap((response) => {
        const data = response.data;
        this.pageState.journey = data;
        this.pageState.selectedTeamLabel = data.teamName ?? '';
      }),
      catchError((error: HttpErrorResponse) => {
        const messageCode = (error?.error as { responseMessage?: { messageCode?: string } })
          ?.responseMessage?.messageCode;
        if (messageCode === 'WC_JOURNEY_UNAVAILABLE') {
          this.pageState.journey = null;
          this.pageState.showNoSimulationState = true;
        } else {
          this.pageState.errorMessage = 'No se pudo cargar el camino del equipo.';
        }
        return of(null);
      }),
      finalize(() => (this.pageState.loading = false)),
    );
  }
}