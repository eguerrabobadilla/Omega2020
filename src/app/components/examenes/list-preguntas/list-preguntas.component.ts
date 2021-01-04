import { Component, OnInit,Input,Output,EventEmitter,ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonVirtualScroll, ModalController } from '@ionic/angular';
import { PreguntasService } from 'src/app/api/preguntas.service';
import { UsuariosService } from 'src/app/api/usuarios.service';
import { DetalleAlumnoPage } from 'src/app/pages/detalle-alumno/detalle-alumno.page';

@Component({
  selector: 'app-list-preguntas',
  templateUrl: './list-preguntas.component.html',
  styleUrls: ['./list-preguntas.component.scss'],
})
export class ListPreguntasComponent implements OnInit {
  value:any;
  textoBuscar: any;
  LstPreguntas: any[] = [];
  contadorInfinieScroll: number = 0;
  public spinnerLoad: boolean=false;
  @ViewChild(IonInfiniteScroll,{static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll,{static: false}) virtualScroll: IonVirtualScroll;
  @Output() onClickPregunta = new EventEmitter();

  constructor(private apiPreguntas: PreguntasService) { 

  }

  ngOnInit() {
    //this.loadData();
  }

  verPregunta(itemPregunta) {
    //console.log(itemPregunta);
    setTimeout(() => {
      this.onClickPregunta.emit(itemPregunta);
    }, 50);
  }

  loadData(event) {
    this.apiPreguntas.getInfinite(this.contadorInfinieScroll,10) .subscribe(data => {
      console.log(data);
      if(data.length!=0) {
        for (let i = 0; i < data.length; i++) {
          this.LstPreguntas.push(data[i]);
        }

        event.target.complete();
        this.virtualScroll.checkEnd();

        this.contadorInfinieScroll += 10;
      }
      else {
        console.log("fin scroll");
        event.target.disabled = true;
      }
    });
  }

}
