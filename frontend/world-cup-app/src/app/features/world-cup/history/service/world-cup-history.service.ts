import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { WorldCupHistoryViewModel } from '../model/world-cup-history-view-model.interface';
import { catchError, Observable, map, tap, finalize, of, switchMap } from 'rxjs';
import { WorldCupHistoryApiResponse } from '../model/world-cup-history-api.interface';


@Injectable({ providedIn: 'root' })
export class WorldCupHistoryService extends BaseApiService {

    private readonly pageState: WorldCupHistoryViewModel =  {
      lang: 'es',
      loading: false,
      errorMessage: '',
      showNoDataState: true,
      totalWorldCups: 0,
      worldCups: [],
    }

    private hasInitialized = false 

    getViewModel(): WorldCupHistoryViewModel {
        return this.pageState;
    }

    initialize(): void {
        if(this.hasInitialized){
            this.loadWorldCupHistory().subscribe();
            return;
        }

        this.hasInitialized = true;
        this.pageState.lang = this.getCurrentLang();
        this.appContextService.lang$.pipe(
            tap((lang) => (this.pageState.lang = lang === 'en'? 'en' : 'es')),
        switchMap(()=> this.loadWorldCupHistory()),
        ).subscribe();
        
    }

    private loadWorldCupHistory() : Observable<void>{

        this.pageState.loading = true;
        this.pageState.errorMessage = ''

        return this.get<WorldCupHistoryApiResponse>(('/world-cup/World-Cup-history')).pipe(
            map((response) => response.data),
            // map((history) => this.normalizeHistory(history)), ???
            tap((history) => {
                this.pageState.showNoDataState = (history?.worldCups ?? []).length === 0;
                this.pageState.totalWorldCups = history?.totalWorldCups ?? 0;
                this.pageState.worldCups = history?.worldCups ?? [];
            }),
            map(()=> undefined),
            catchError(() => {
                this.pageState.totalWorldCups = 0;
                this. pageState.worldCups = [];
                this.pageState.errorMessage = 'No se pudo cargar el historial de mundiales';
                return of(undefined);
            }),
            finalize(() => (this.pageState.loading = false))
        )
    }
}
