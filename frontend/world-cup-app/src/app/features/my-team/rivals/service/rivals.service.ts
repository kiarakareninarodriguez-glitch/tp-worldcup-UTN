import { Injectable } from '@angular/core';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { RivalsApiResponse } from '../model/rivals-api.interface';
import { RivalsViewModel } from '../model/rivals-view-model.interface';

@Injectable({ providedIn: 'root' })
export class RivalsService extends BaseApiService {
  private readonly pageState: RivalsViewModel = {
    rivals: [],
    totalRivals: 0,
    loading: false,
    errorMessage: '',
    lang: 'es',
    selectedTeamLabel: 'SEN',
  };

  getViewModel(): RivalsViewModel {
    return this.pageState;
  }

  initialize(): void {
    this.loadRivals().subscribe();
  }

  private loadRivals() {
    this.pageState.loading = true;
    this.pageState.errorMessage = '';

    return this.get<RivalsApiResponse>('/my-team/rivals', { lang: this.pageState.lang }).pipe(
      map((response) => response.data),
      tap((payload) => {
        this.pageState.rivals = payload?.rivals ?? [];
        this.pageState.totalRivals = payload?.totalRivals ?? 0;
      }),
      catchError(() => {
        this.pageState.rivals = [];
        this.pageState.totalRivals = 0;
        this.pageState.errorMessage = 'No se pudieron cargar los rivales históricos.';
        return of(undefined);
      }),
      finalize(() => {
        this.pageState.loading = false;
      }),
    );
  }
}