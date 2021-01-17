import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AlertController, LoadingController, ModalController, IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { ExamenesService } from 'src/app/api/examenes.service';
import { CrearExamenPage } from 'src/app/pages/crear-examen/crear-examen.page';
import { DetalleResultadosExamenesPage } from 'src/app/pages/detalle-resultados-examenes/detalle-resultados-examenes.page';
import { DetalleExamenAlumnoPage } from '../../pages/detalle-examen-alumno/detalle-examen-alumno.page';

@Component({
  selector: 'app-list-examenes',
  templateUrl: './list-examenes.component.html',
  styleUrls: ['./list-examenes.component.scss'],
})
export class ListExamenesComponent implements OnInit {
  LstExamenes: any[] = [];
  materiaId: any;
  loading: any;
  visto = false;
  visto2 = false;
  cargarConFiltro = false;
  spiner = true;
  contadorInfinieScroll = 0;
  @Output() updateAutoHeightSlider = new EventEmitter();
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;

  constructor(private apiExamenes : ExamenesService, private modalCrl: ModalController, 
              private loadingController: LoadingController, private alertController: AlertController) { 

  }

  ngOnInit() {
    

   /* this.apiExamenes.getListaExamanes().subscribe(data => {
      console.log(data);
      this.LstExamenes = JSON.parse(JSON.stringify(data['examenes']));
      console.log(this.LstExamenes);
      this.updateAutoHeightSlider.emit();
      this.spiner =false;
    });*/
    //comentado eduardo guerra
    this.apiExamenes.getInfinite(this.contadorInfinieScroll, 10).subscribe(data => {
      this.LstExamenes = data;
      this.contadorInfinieScroll += 10;
      this.updateAutoHeightSlider.emit();
      this.spiner =false;
    });
  }

  public async cargar(materiaId) {
    // 0=todas 1=Filtrado por materia
    this.materiaId = materiaId;

    await this.cargandoAnimation('Cargando...');
    this.infiniteScroll.disabled= false;
    if (materiaId == 0) {
      this.contadorInfinieScroll = 0;
      this.LstExamenes = [];
      this.infiniteScroll.disabled= false;

      this.apiExamenes.getInfinite(this.contadorInfinieScroll, 10).subscribe(data => {
        if (data.length != 0) {
          for (let i = 0; i < data.length; i++) {
            console.log('dentro');
            this.LstExamenes.push(data[i]);
          }
          setTimeout(() => {
            this.updateAutoHeightSlider.emit();
          }, 300);
          this.contadorInfinieScroll += 10;

          this.virtualScroll.checkEnd();
         
          this.loadingController.dismiss();
        }
      });
      this.cargarConFiltro = false;

    } else {
      this.contadorInfinieScroll = 0;
      this.LstExamenes = [];
      this.infiniteScroll.disabled= false;

      this.apiExamenes.getTareasMateriasInfinite(materiaId, this.contadorInfinieScroll, 10).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          console.log('dentro');
          this.LstExamenes.push(data[i]);
        }
        setTimeout(() => {
          this.updateAutoHeightSlider.emit();
        }, 300);
        this.contadorInfinieScroll += 10;

        this.virtualScroll.checkEnd();
        this.loadingController.dismiss();
      });
      this.cargarConFiltro = true;
    }
  }

  public async editaExamen(event, item) {
    event.stopPropagation();

    const modal = await this.modalCrl.create({
      component: CrearExamenPage,
      // cssClass: 'my-custom-modal-css',
      cssClass: 'my-custom-modal-css-capturas',
      showBackdrop: false,
      componentProps: {item},
      mode: 'ios',
      backdropDismiss: true
    });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {

        if (data.data.banderaEdito == true) {
            await this.cargandoAnimation('Cargando...');
            //this.LstExamenes = await this.apiTareas.get().toPromise();
            this.loadingController.dismiss();
        }
    });
  }

  public async iniciarExamen(event, item) {
    event.stopPropagation();
  //  console.log(item);
    const modal = await this.modalCrl.create({
      component: DetalleExamenAlumnoPage,
      // cssClass: 'my-custom-modal-css',
      cssClass: 'my-custom-modal-css-capturas',
      showBackdrop: false,
      componentProps: {item},
      mode: 'ios',
      backdropDismiss: true
    });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {

        if (data.data.banderaEdito == true) {
            await this.cargandoAnimation('Cargando...');
            //this.LstExamenes = await this.apiTareas.get().toPromise();
            this.loadingController.dismiss();
        }
    });
  }

  public permisoEditar() {
    const jwt_temp = localStorage.getItem('USER_INFO_TEMP');
    if (jwt_temp != null) {
        return false;
    }

    if (this.getKeyToken('tipo') == 'Profesor') {
      return true;
    }
    else {
      return false;
    }
  }

    // Eliminar tarea
    public async eliminar(event, item) {
      event.stopPropagation();
      console.log(item);
  
      const alertTerminado = await this.alertController.create({
        header: 'ELIMINAR',
        message: '¿Está seguro de ELIMINAR el examen?',
        buttons: [
          {
            text: 'No', handler: () =>  {
              return;
            }
          },
          {
            text: 'Si', handler: async () => {
              const loading = await this.loadingController.create({
                message: 'Eliminando...'
              });
              
  
              await loading.present();
  
              await this.apiExamenes.delete(item.Id).toPromise();
  
              this.LstExamenes = this.LstExamenes.filter(obj => obj !== item);
  
              this.loadingController.dismiss();
  
              this.alertController.dismiss();
            }
          }
        ]
      });
  
      alertTerminado.present();
    }

    async cargandoAnimation(text) {
      this.loading = await this.loadingController.create({
        message: text,
        duration: 60000
      });
  
      await this.loading.present();
    }

    getKeyToken(key: string): string {

      const jwt = localStorage.getItem('USER_INFO');
  
      const jwtData = jwt.split('.')[1];
      // let decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtJsonData = decodeURIComponent(escape(window.atob(jwtData)));
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
  
      const value = decodedJwtData[key];
  
      return value;
    }

    async openDetail($event,item) {
      const modal = await this.modalCrl.create({
        component: DetalleResultadosExamenesPage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        componentProps: {item}
      });
      setTimeout(() => {
        console.log(item.Id);
        if(item.Id== 14170){
          this.visto2 = true;
        }
        else{
          this.visto= true;
        }
      }, 1000);

    return await modal.present();
    }

    abrirExamen($event,item){
       if(this.permisoEditar()) this.openDetail($event,item);
       else this.iniciarExamen($event,item);
    }

    loadData(event) {
      console.log('loaddata');
      if (this.cargarConFiltro) {
 
       this.getApiTareasConFiltro(event);
 
     } else {
 
       this.getApiTareasSinFiltro(event);
 
     }
 
   }
     getApiTareasSinFiltro(event) {
       console.log('cargarSinfiltro');
       this.apiExamenes.getInfinite(this.contadorInfinieScroll, 10).subscribe(data => {
         console.log('getInfinite');
         console.log(data);
         if (data.length != 0) {
           for (let i = 0; i < data.length; i++) {
             console.log('dentro');
             this.LstExamenes.push(data[i]);
           }
 
           event.target.complete();
           this.contadorInfinieScroll += 10;
           setTimeout(() => {
             this.updateAutoHeightSlider.emit();
           }, 300);
           this.virtualScroll.checkEnd();
         } else {
           console.log('fin scroll');
           event.target.disabled = true;
           setTimeout(() => {
             this.updateAutoHeightSlider.emit();
             }, 300);
         }
       });
 
     }
     getApiTareasConFiltro(event) {
       console.log('cargarConfiltro');
       console.log(event);
 
       this.apiExamenes.getTareasMateriasInfinite(this.materiaId, this.contadorInfinieScroll, 10).subscribe(data => {
         console.log('getInfinite');
         console.log(data);
         if (data.length != 0) {
           for (let i = 0; i < data.length; i++) {
             console.log('dentro');
             this.LstExamenes.push(data[i]);
           }
 
           event.target.complete();
           this.contadorInfinieScroll += 10;
           setTimeout(() => {
             this.updateAutoHeightSlider.emit();
           }, 300);
           this.virtualScroll.checkEnd();
         } else {
           console.log('fin scroll');
           event.target.disabled = true;
           setTimeout(() => {
         this.updateAutoHeightSlider.emit();
         }, 300);
         }
       });
     }


}
