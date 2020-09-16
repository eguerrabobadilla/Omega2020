import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { AlumnosService } from 'src/app/api/alumnos.service';

@Component({
  selector: 'app-escolaridad',
  templateUrl: './escolaridad.component.html',
  styleUrls: ['./escolaridad.component.scss'],
})
export class EscolaridadComponent implements OnInit {
  @Output() detail = new EventEmitter();
  TotalKinder: number=0;
  TotalPrimaria: number=0;
  TotalSecundaria: number=0;
  TotalPreparatoria: number=0;
  cargado:boolean = false;

  constructor(private apiAlumnos: AlumnosService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.cargar();  
    }, 500);
  }

  async cargar() {
    this.cargado=false;

    this.apiAlumnos.getTotales().subscribe(data =>{
      data.forEach(item => {
        if(item.Escolaridad=="Kinder")
            this.TotalKinder=item.Total;
        else if(item.Escolaridad=="Elementary School")
            this.TotalPrimaria=item.Total;
        else if(item.Escolaridad=="Junior High School")
            this.TotalSecundaria=item.Total;
        else if(item.Escolaridad=="High School")
            this.TotalPreparatoria=item.Total;
      });

      this.cargado=true;
    });
  }


  openDetail(index,escolaridad) {
    let item = {
      index: index,
      escolaridad: escolaridad
    };

    setTimeout(() => {
      this.detail.emit(item);
    }, 200);
  }

}
