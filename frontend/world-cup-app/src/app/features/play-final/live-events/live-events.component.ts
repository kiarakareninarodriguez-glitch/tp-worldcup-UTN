import { Component, OnInit } from '@angular/core';
import { LiveEventsService } from './live-events.service';

@Component({
  selector: 'app-live-events-page',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.css'],
})
export class LiveEventsPageComponent implements OnInit {

  eventos: any[] = [];

  constructor(private liveEventsService: LiveEventsService) {}

  ngOnInit(): void {
    this.liveEventsService.getLiveEvents().subscribe({
      next: (data: any[]) => {
        this.eventos = data;
      },
      error: (err: any) => {
        console.error('Error en la consola:', err);
      }
    });
  }
}
