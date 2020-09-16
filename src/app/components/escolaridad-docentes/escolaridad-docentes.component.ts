import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { DocentesService } from 'src/app/api/docentes.service';

@Component({
  selector: 'app-escolaridad-docentes',
  templateUrl: './escolaridad-docentes.component.html',
  styleUrls: ['./escolaridad-docentes.component.scss'],
})
export class EscolaridadDocentesComponent implements OnInit {
  @Output() detail = new EventEmitter();
  TotalKinder: number=0;
  TotalPrimaria: number=0;
  TotalSecundaria: number=0;
  TotalPreparatoria: number=0;
  cargado:boolean = false;

  constructor(private apiDocentes: DocentesService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.cargar();  
    }, 500);
  }

  async cargar() {
    this.cargado=false;

    this.apiDocentes.getTotales().subscribe(data =>{
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
