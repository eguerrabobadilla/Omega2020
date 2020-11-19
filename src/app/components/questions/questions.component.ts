import { Component, OnInit } from '@angular/core';
import { PreguntasSoporteService } from 'src/app/api/preguntas-soporte.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  preguntas: any[] = [];
  constructor(private apiPreguntas: PreguntasSoporteService) {
    
   }

  ngOnInit() {
      this.apiPreguntas.get().subscribe(data => {
        this.preguntas=data;
      });
  }
}
