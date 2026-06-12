import { inject, Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { AdminService } from 'src/app/shared/admin/service/admin.service';
import { GroupsViewModel } from '../model/groups-view-model.interface';
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
import { GroupsApiResponse, GroupTableApiItem } from '../model/groups-api.interface';

@Injectable({ providedIn: 'root' })
export class GroupsService extends BaseApiService {

  private readonly adminService = inject(AdminService);
  private hasInitialized = false;

  // Inicializamos el pageState con valores por defecto
  private readonly pageState: GroupsViewModel = {
    lang: 'es',
    loading: false,
    errorMessage: '',
    showNoSimulationState: false,
    selectedTeamLabel: '',
    selectedGroup: null,
    selectedGroupData: null,
    groups: [],
  };

  getViewModel(): GroupsViewModel {
    return this.pageState;
  }

  initialize(): void {
    if (this.hasInitialized) {
      this.loadGroups().subscribe();
      return;
    }

    this.hasInitialized = true;
    this.pageState.lang = this.getCurrentLang();
    this.pageState.selectedTeamLabel = this.adminService.getCurrentTeam()?.name ?? '';

    // combineLatest — igual que squad: si cambia el equipo o idioma recarga
    combineLatest([this.appContextService.currentTeamId$, this.appContextService.lang$])
      .pipe(switchMap(() => this.loadGroups()))
      .subscribe();
  }

  // Se llama cuando el usuario hace click en un tab de grupo
  selectGroup(groupId: string): void {
    this.pageState.selectedGroup = groupId;
    this.pageState.selectedGroupData =
      this.pageState.groups.find((g) => g.group === groupId) ?? null;
  }

  private loadGroups(): Observable<void> {
    const lang = this.getCurrentLang();
    this.pageState.lang = lang;
    this.pageState.loading = true;
    this.pageState.errorMessage = '';
    this.pageState.showNoSimulationState = false;

    return this.get<GroupsApiResponse>('/world-cup/groups', { lang }).pipe(
      map((response) => response.data),
      tap((payload) => {
        this.pageState.groups = payload?.groups ?? [];
        this.pageState.selectedGroup = payload?.selectedGroup ?? this.pageState.groups[0]?.group ?? null;
        this.pageState.selectedGroupData =
          this.pageState.groups.find((g) => g.group === this.pageState.selectedGroup) ?? null;
      }),
      map(() => undefined),
      catchError((error) => {
        const messageCode = error?.error?.messageCode;
        if (messageCode === 'WC_GROUPS_UNAVAILABLE') {
          this.pageState.showNoSimulationState = true;
        } else {
          this.pageState.errorMessage = 'No se pudieron cargar los grupos. Intentá de nuevo.';
        }
        this.pageState.groups = [];
        return of(undefined);
      }),
      finalize(() => (this.pageState.loading = false)),
    );
  }
}
