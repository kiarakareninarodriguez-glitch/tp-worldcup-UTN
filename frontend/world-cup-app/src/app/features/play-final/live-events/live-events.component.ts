import { Component, OnInit } from '@angular/core';
import { LiveEventsService } from './service/live-events.service';
import { LiveEventsViewModel } from './model/live-events-view-model.interface';

@Component({
  selector: 'app-live-events-page',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.css'],
})
export class LiveEventsPageComponent implements OnInit {

  constructor(private liveEventsService: LiveEventsService) {}

  ngOnInit(): void {
    this.liveEventsService.initialize();

   
  }

  
  get vm():LiveEventsViewModel{
    return this.liveEventsService.getViewModel();
  }
}