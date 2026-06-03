import { Component, OnInit } from '@angular/core';
import { JourneyViewModel } from './model/journey-view-model.interface';
import { JourneyService } from './service/journey.service';

@Component({
  selector: 'app-journey-page',
  standalone: false,
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css'],
})
export class JourneyPageComponent implements OnInit {
  constructor(private readonly journeyService: JourneyService) {}

  get pageState(): JourneyViewModel {
    return this.journeyService.getViewModel();
  }

  ngOnInit(): void {
    this.journeyService.initialize();
  }

  getResultClass(resultStyle: string): string {
    switch (resultStyle) {
      case 'WIN': return 'j-win';
      case 'LOSS': return 'j-loss';
      case 'DRAW': return 'j-draw';
      default: return 'j-pending';
    }
  }

  getResultBadgeClass(resultStyle: string): string {
    switch (resultStyle) {
      case 'WIN': return 'badge-win';
      case 'LOSS': return 'badge-loss';
      case 'DRAW': return 'badge-draw';
      default: return 'badge-gray';
    }
  }
}
