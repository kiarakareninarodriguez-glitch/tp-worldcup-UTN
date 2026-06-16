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
  isEditing = false
  currentStrategy = this.coachingService

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


  cambiarFormacion(formacion:string|undefined){
    if(formacion){
      this.pageService.selectFormation(formacion).subscribe()
    }

  }
  cambiarEstrategia(estrategia:string|undefined){
    if(estrategia){
      this.pageService.selectStrategy(estrategia).subscribe()
    }

  }

  mostrarOcultar(): void {
    
    this.isEditing = !this.isEditing;
  }

  

  
}

    