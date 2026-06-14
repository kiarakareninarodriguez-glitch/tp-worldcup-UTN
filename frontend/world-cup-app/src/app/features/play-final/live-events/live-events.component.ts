import { Component, OnInit } from '@angular/core';
import { LiveEventsService } from './service/live-events.service';
import { LiveEventsViewModel } from './model/live-events-view-model.interface';

@Component({
  selector: 'app-live-events-page',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.css'],
})
export class LiveEventsPageComponent implements OnInit {

  vm: LiveEventsViewModel = {
    lang: 'es',
    loading: true,
    errorMessage: '',
    showNoFinalState: false,
    data: null
  };

  constructor(private liveEventsService: LiveEventsService) {}

  ngOnInit(): void {
    this.liveEventsService.getLiveEvents().subscribe({
      next: (resp: any) => {
        this.vm.data = resp.data;
        this.vm.loading = false;
      },
      error: () => {
        this.vm.errorMessage = 'Error cargando eventos';
        this.vm.loading = false;
      }
    });
  }
}