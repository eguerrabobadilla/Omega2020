import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExamenesService } from '../../api/examenes.service';
import { IonVirtualScroll, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-resultado-profesor',
  templateUrl: './detalle-resultado-profesor.page.html',
  styleUrls: ['./detalle-resultado-profesor.page.scss'],
})
export class DetalleResultadoProfesorPage implements OnInit {

  @Input() item;
  resultadoExamen: any;
  spiner=false;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;

  constructor(private apiExamenes: ExamenesService,private modalCtrl: ModalController) { }

  ngOnInit() {
    this.preguntaFinalizarExamen();
  }

  async preguntaFinalizarExamen(){
    try {
    console.log("item")
    console.log(this.item)

      this.apiExamenes.examenTerminadoVistaProfesor(this.item.ExamenId,this.item.Id).subscribe(data  =>{
        console.log(data['Preguntas']);
         this.resultadoExamen=data;
         setTimeout(() => {
          this.spiner=false;

          setTimeout(() => {
            this.virtualScroll.checkEnd();
          }, 500);
         
          
        });
  

   });
      
      
    } catch (error) {
      console.error(error);

    }
   
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

}
