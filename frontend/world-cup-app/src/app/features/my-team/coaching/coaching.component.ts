import { Component, OnInit, inject } from '@angular/core';
import { CoachingService } from './service/coaching.service'; 
import { CoachingViewModel } from './model/coaching-view-model.interface'; 


@Component({
  selector: 'app-coaching',
  standalone: false,
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.css']
})
export class CoachingComponent implements OnInit {
  private readonly coachingService = inject(CoachingService);

  constructor(private readonly pageService: CoachingService) { }

  get pageState(): CoachingViewModel {
    return this.pageService.getviewModel();
  }

  ngOnInit(): void {
    this.coachingService.initialize();
  }

  getviewModel(): CoachingViewModel {
    return this.coachingService.getviewModel();
  }

  

  
}

/* seleccionarEstrategia(): void { */
    