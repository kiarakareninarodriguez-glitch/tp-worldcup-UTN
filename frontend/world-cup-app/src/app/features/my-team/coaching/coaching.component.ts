import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coaching-page',
  standalone: false,
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.css'],
})
export class CoachingComponent implements OnInit {
  isLoading = true;
  coachName = 'Cargando entrenador...';
  trainingPlan = 'Cargando plan de entrenamiento...';

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}


 /* private initializeCoachingData(): void {
    // Simulate loading data from an API or service.
    setTimeout(() => {
      this.coachName = 'Director Técnico';
      this.trainingPlan = 'Plan de entrenamiento táctico y físico listo para el próximo partido.';
      this.isLoading = false;
    }, 500);
  }
}
*/
