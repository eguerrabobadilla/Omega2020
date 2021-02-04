import { Component, OnInit,Input,Output,EventEmitter,ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, IonVirtualScroll, LoadingController, ModalController } from '@ionic/angular';
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
  puntosPreguntas=0;
  @ViewChild(IonInfiniteScroll,{static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll,{static: false}) virtualScroll: IonVirtualScroll;
  @Output() onClickPregunta = new EventEmitter();
  @Output() loadSpinner = new EventEmitter();
  @Input() examen;

  constructor(private apiPreguntas: PreguntasService,private alertController: AlertController,
              private loadingController: LoadingController) { 

  }

  ngOnInit() {
    setTimeout(() => {
      this.loadData2();
    });
  }

  verPregunta(itemPregunta) {
    //console.log(itemPregunta);
    setTimeout(() => {
      this.onClickPregunta.emit(itemPregunta);
    }, 50);
  }

  async deletePregunta(event,item,numPregunta){

    try  {
        event.stopPropagation();

        const alertTerminado = await this.alertController.create({
          header: 'ELIMINAR',
          message: '¿Está seguro de ELIMINAR la Pregunta ' + numPregunta +'?',
          buttons: [
            {
              text: 'No', handler: () =>  {
                return;
              }
            },
            {
              text: 'Si', handler: async () => {
                try {
                    const loading = await this.loadingController.create({
                      message: 'Eliminando...'
                    });

                    await loading.present();

                    await this.apiPreguntas.delete(item.ExamenId,item._id).toPromise();

                    this.puntosPreguntas-= item.Puntos;

                    this.LstPreguntas = this.LstPreguntas.filter(obj => obj !== item);

                    this.loadingController.dismiss();

                    /*await this.apiTareas.delete(item.Id).toPromise();

                    this.LstTareas = this.LstTareas.filter(obj => obj !== item);

                    this.loadingController.dismiss();

                    this.alertController.dismiss();*/
                  } catch(err) {
                  await this.loadingController.dismiss();

                  const alert = await this.alertController.create({
                    header: 'LBS Plus',
                    //subHeader: 'Subtitle',
                    message: err.error,
                    buttons: ['Aceptar']
                  });
              
                  await alert.present();
                }
              }
            }
          ]
        });

        alertTerminado.present();
      } catch(err) {

        await this.loadingController.dismiss();

        const alert = await this.alertController.create({
          header: 'LBS Plus',
          //subHeader: 'Subtitle',
          message: err.error,
          buttons: ['Aceptar']
        });
    
        await alert.present();

      }
  }

  async loadData2() {
    /*const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();*/

    this.puntosPreguntas=0;

    //this.spiner =true;
    this.loadSpinner.emit(true);

    this.apiPreguntas.getInfinite(this.contadorInfinieScroll,10,this.examen.Id) .subscribe(data => {
      this.LstPreguntas=data;
      this.LstPreguntas.forEach(a => this.puntosPreguntas += a.Puntos);
      this.loadSpinner.emit(false);
      //this.loadingController.dismiss();
    });
  }

  //Load data con infinite scroll
  loadData(event) {
    this.apiPreguntas.getInfinite(this.contadorInfinieScroll,10,this.examen.Id) .subscribe(data => {
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
