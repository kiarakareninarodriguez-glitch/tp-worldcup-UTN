import { Component, OnInit } from '@angular/core';
import { FinalChatViewModel } from './model/final-chat-view-model.interface';
import { FinalChatService } from './service/final-chat.service';
import { FinalChatOptionApiItem } from './model/final-chat-api.interface';

@Component({
  selector: 'app-final-chat-page',
  standalone: false,
  templateUrl: './final-chat.component.html',
  styleUrls: ['./final-chat.component.css'],
})
export class FinalChatPageComponent implements OnInit {
  textoInput: string = '';
  sugerencias: FinalChatOptionApiItem[] = [];

  constructor(private readonly pageService: FinalChatService) { }
  get pageState(): FinalChatViewModel {
    return this.pageService.getViewModel();
  }

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onStartfinal(): void {
    //iniciar o continuar final
    this.pageService.startFinal().subscribe()
  }

  filtrarSugerencias() {
    const busqueda = this.textoInput.trim().toLowerCase();
    if (!busqueda) {
      this.sugerencias = [];
      return;
    }

    this.sugerencias = this.pageState?.data?.options.filter(opcion =>
      opcion.index.toString().includes(busqueda) ||
      opcion.action.toLowerCase().includes(busqueda) ||
      opcion.label.toLowerCase().includes(busqueda)
    ) ?? [];

  }
  seleccionarSugerencia(opcion: FinalChatOptionApiItem) {
    this.textoInput = opcion.label; // Setea el texto en el input
    this.sugerencias = []; // Limpiamos las sugerencias
  }

  esOpcionValida(): boolean {
    const valor = this.textoInput.trim().toLowerCase();
    if (!valor) return false;

    // Retorna true si lo escrito coincide con index, key o descripción
    return this.pageState?.data?.options.some(opcion =>
      opcion.index.toString() === valor ||
      opcion.action.toLowerCase() === valor ||
      opcion.label.toLowerCase() === valor
    ) ?? false;
  }

  enviarOrden() {
    if (this.esOpcionValida()) {
      const valorFinal = this.textoInput.trim().toLowerCase();

      const opcionElegida = this.pageState?.data?.options.find(opcion =>
        opcion.index.toString() === valorFinal.trim() ||
        opcion.action.toLowerCase() === valorFinal.trim().toLowerCase() ||
        opcion.label.toLowerCase() === valorFinal.trim().toLowerCase()
      );
      if (opcionElegida) {
        this.pageService.playFinal(opcionElegida.index).subscribe();
      }
      this.textoInput = '';
      this.sugerencias = [];
    }
  }
  onSelectOption(currentOption: FinalChatOptionApiItem): void {
    this.pageService.playFinal(currentOption.index).subscribe()
  }
}

