import { Injectable, inject } from '@angular/core';
import { catchError, combineLatest, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { LiveEventsViewModel } from '../model/live-events-view-model.interface';
import { LiveEventsApiResponse } from '../model/live-events-api.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LiveEventsService extends BaseApiService {
  private readonly vm: LiveEventsViewModel = {
    lang: 'es',
    loading: false,
    errorMessage: '',
    showNoFinalState: false,
    data: null,
  };
    private hasInitialized = false;

  getViewModel(): LiveEventsViewModel {
    return this.vm;
  }

  
    initialize(): void {
      if (this.hasInitialized) {
        this.getLiveEvents().subscribe();
        return;
      }
  
      this.hasInitialized = true;
      this.vm.lang = this.getCurrentLang();
  
      combineLatest([
        this.appContextService.currentTeamId$,
        this.appContextService.lang$,
        this.appContextService.worldCupRefresh$,
      ])
        .pipe(
          tap(([, lang]) => (this.vm.lang = lang === 'en' ? 'en' : 'es')),
          switchMap(() => this.getLiveEvents()),
        )
        .subscribe();
    }

    
  public getLiveEvents(): Observable<void> {
      const lang = this.getCurrentLang();
      this.vm.lang = lang;
      this.vm.loading = true;
      this.vm.errorMessage = '';
  
      return this.get<LiveEventsApiResponse>('/final-match/team-state', { lang })
      .pipe(
        map((response) => response.data),
        tap((resp) => {
          
         this.vm.data = resp ?? null;

        
        this.vm.showNoFinalState = !this.vm.data;

        this.vm.loading = false;
        
        }),
        tap(() => (this.vm.showNoFinalState = false)),
        map(() => undefined),
        catchError((error: HttpErrorResponse) => {          
  
          this.vm.data = null;
          this.vm.showNoFinalState = true;
          this.vm.errorMessage = 'No se pudieron cargar los datos de la final.';
          return of(undefined);
        }),
        finalize(() => (this.vm.loading = false)),
      );
    }
    
  
}