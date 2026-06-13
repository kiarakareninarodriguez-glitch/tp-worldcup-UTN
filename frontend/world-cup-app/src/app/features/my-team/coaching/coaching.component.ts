import { Component, OnInit, inject } from '@angular/core';
import { CoachingService } from './service/coaching.service'; 
import { CoachingViewModel } from './model/coaching-view-model.interface'; 
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit {
  private readonly coachingService = inject(CoachingService);

  constructor() {}

  ngOnInit(): void {
    this.coachingService.initialize();
  }


  getviewModel(): CoachingViewModel {
    return this.coachingService.getviewModel();
  }
}
