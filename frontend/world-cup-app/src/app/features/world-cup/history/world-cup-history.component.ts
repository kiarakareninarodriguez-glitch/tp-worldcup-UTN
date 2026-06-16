import { Component, OnInit } from '@angular/core';
import { WorldCupHistoryService } from './service/world-cup-history.service';
import { WorldCupHistoryViewModel } from './model/world-cup-history-view-model.interface';

@Component({
  selector: 'app-world-cup-history-page',
  standalone: false,
  templateUrl: './world-cup-history.component.html',
  styleUrls: ['./world-cup-history.component.css'],
})
export class WorldCupHistoryPageComponent implements OnInit {
  constructor (private readonly pageService : WorldCupHistoryService){}

  get pageState(): WorldCupHistoryViewModel {
    return this.pageService.getViewModel();
  }

  ngOnInit(): void {
    this.pageService.initialize();
  }

  
}
