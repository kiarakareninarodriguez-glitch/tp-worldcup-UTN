import { inject, Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { UiVisualsService } from 'src/app/core/services/ui-visuals.service';
import { AdminService } from 'src/app/shared/admin/service/admin.service';
import { FinalChatViewModel } from '../model/final-chat-view-model.interface';
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
import { FinalChatApiResponse, FinalChatTeamsPreviewApiResponse } from '../model/final-chat-api.interface';
import { HttpErrorResponse } from '@angular/common/http';
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
    private hasInitialized = false;


    getViewModel(): FinalChatViewModel {
        return this.pageState;
    }

    initialize() {

        if (this.hasInitialized) {
            this.loadPreview().subscribe();
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
                switchMap(() => this.loadPreview()),
            )
            .subscribe();



    }

    private loadPreview(): Observable<void> {

        const lang = this.getCurrentLang();
        this.pageState.lang = lang;
        this.pageState.loading = true;
        this.pageState.errorMessage = '';

        return this.get<FinalChatTeamsPreviewApiResponse>('/final-match/preview', { lang })
            .pipe(
                map((response) => response.data),
                map((previewResponse) => this.normalizePreview(previewResponse)),
                tap((previewResponse) => (this.pageState.teamsPreview = previewResponse)),
                tap(() => (this.pageState.showNoFinalState = false)),
                map(() => undefined),
                catchError((error: HttpErrorResponse) => {



                    if (this.isMatchUnavailableError(error)) {
                        this.pageState.teamsPreview = null;
                        this.pageState.showNoFinalState = true;
                        this.pageState.errorMessage = '';
                        return of(undefined);
                    }
                    if (this.isMatchNotFound(error)) {
                        this.pageState.teamsPreview = null;
                        this.pageState.showNoFinalState = true;
                        this.pageState.errorMessage = 'inicie simulacion del final primero';
                        return of(undefined);

                    }


                    this.pageState.teamsPreview = null;
                    this.pageState.showNoFinalState = true;
                    this.pageState.errorMessage = 'No se pudieron cargar los datos de la final.';
                    return of(undefined);
                }),
                finalize(() => (this.pageState.loading = false)),
            );



    }
    private normalizePreview(
        previewResponse: FinalChatTeamsPreviewApiResponse | null | undefined,
    ): FinalChatTeamsPreviewApiResponse | null {
        if (!previewResponse) {
            return null;
        }

        return {
            ...previewResponse,
            teamFlag: this.uiVisualsService.getTeamFlag(previewResponse.teamId),
            opponentFlag: this.uiVisualsService.getTeamFlag(previewResponse.opponentId),

        };
    }



    private isMatchUnavailableError(error: HttpErrorResponse): boolean {
        const messageCode = (error?.error as { responseMessage?: { messageCode?: string } } | undefined)
            ?.responseMessage?.messageCode;

        return messageCode === 'WC_FINAL_CHAT_PREVIEW_UNAVAILABLE';
    }
    private isMatchNotFound(error: HttpErrorResponse): boolean {
        const messageCode = (error?.error as { responseMessage?: { messageCode?: string } } | undefined)
            ?.responseMessage?.messageCode;

        return messageCode === 'WC_FINAL_CHAT_PREVIEW_NOT_FOUND';
    }

    startFinal(): Observable<void> {
        this.pageState.starting = true;
        this.pageState.actionErrorMessage = '';
        const lang = this.getCurrentLang();

        // Asumo que la API te devuelve un objeto con la data del chat (ej: FinalChatResponse)
        return this.post<FinalChatApiResponse>('/final-match/start', { lang }).pipe(
            // 'response.data' contiene la estructura del chat activo
            map((response) => response.data),
            map((response) => this.normalizedata(response)),

            tap((chatActiveData) => {
                // Guardamos la data del chat en el estado. 
                // Al hacer esto, el HTML va a reaccionar instantáneamente.
                this.pageState.data = chatActiveData;

            }),
            switchMap(() => this.loadPreview()),
            map(() => undefined), // Mapeamos a void para mantener la firma limpia
            catchError((error: HttpErrorResponse) => {
                this.pageState.actionErrorMessage = 'No se pudo iniciar el chat.';
                return of(undefined);
            }),
            finalize(() => {
                this.pageState.starting = false;
            })
        );
    }
    normalizedata(response: FinalChatApiResponse): FinalChatApiResponse {

        return {
            ...response,
            teamFlag: this.uiVisualsService.getTeamFlag(response.teamId),
            opponentFlag: this.uiVisualsService.getTeamFlag(response.opponentId),
            messageItems: response.messageItems.map(msg => {
                return {
                    ...msg,
                    icon: this.uiVisualsService.getFinalChatMessageIcon(msg.type)
                }
            })
        };
    }

    playFinal(option: number): Observable<void> {
        //TODO llamar jugar opcion de la final
        this.pageState.sending = true;
        this.pageState.actionErrorMessage = '';
        const lang = this.getCurrentLang();

        return this.post<FinalChatApiResponse>('/final-match/play', { option, lang }).pipe(
            map((response) => response.data),
            map((response) => this.normalizedata(response)),
            tap((updatedChatData) => {
                // Actualiza el flujo de mensajes/opciones con la nueva respuesta
                this.pageState.data = {
                    ...updatedChatData,
                    messageItems: [...this.pageState.data?.messageItems ?? [], ...updatedChatData.messageItems]
                };
            }),
            map(() => undefined),
            catchError((error: HttpErrorResponse) => {
                this.pageState.actionErrorMessage = 'No se pudo procesar la opción seleccionada.';
                return of(undefined);
            }),
            finalize(() => {
                this.pageState.sending = false;
            })
        );
    }

}