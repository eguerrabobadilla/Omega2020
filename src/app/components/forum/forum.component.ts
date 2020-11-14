import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { ForumService } from '../../api/forum.service';
import { DetallesForumPage } from '../../pages/detalles-forum/detalles-forum.page';
import { AlertController, ModalController, LoadingController, IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { CrearForumPage } from 'src/app/pages/crear-forum/crear-forum.page';




@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
})
export class ForumComponent implements OnInit {
  public LstForo: any[] = [];
  materiaId: any = 0;
  estadoFoto:any;
  loading: any;
  spiner = true;
  cargarConFiltro = false;
  contadorInfinieScroll: number = 0;
  @ViewChild(IonInfiniteScroll,{static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll,{static: false}) virtualScroll: IonVirtualScroll;
  @Output() updateAutoHeightSlider = new EventEmitter();


  constructor(private apiForum: ForumService, private modalCrl: ModalController,private alertController: AlertController,
              private loadingController: LoadingController) {

  }

  ngOnInit() {
   // this.cargar(0);
   this.apiForum.getInfinite(this.contadorInfinieScroll,10).subscribe(data => {
    this.LstForo = data;
    this.contadorInfinieScroll +=10;
    this.updateAutoHeightSlider.emit();
    this.spiner =false;
  });
  }

  public async cargar(materiaId) {
    console.log("cargar");
    console.log(materiaId);
    // 0=todas 1=Filtrado por materia
    this.materiaId = materiaId;

    await this.cargandoAnimation('Cargando...');
    this.infiniteScroll.disabled= false;
    if (materiaId == 0) {
      this.contadorInfinieScroll = 0;
      this.LstForo = [];
      this.infiniteScroll.disabled= false;

      this.apiForum.getInfinite(this.contadorInfinieScroll, 10).subscribe(data => {
        if (data.length != 0) {
          for (let i = 0; i < data.length; i++) {
            console.log('dentro');
            this.LstForo.push(data[i]);
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
      this.LstForo = [];
      this.infiniteScroll.disabled= false;

      this.apiForum.getForosMateriasInfinite(materiaId, this.contadorInfinieScroll, 10).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          console.log('dentro');
          this.LstForo.push(data[i]);
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

  async openDetail(event: Event, item , itemid) {

    /*this.apiForum.get(true,0).subscribe(data =>{
    });*/

    const modal = await this.modalCrl.create({
        component: DetallesForumPage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        componentProps: {item}
      });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
      this.LstForo = await this.apiForum.get(false, 0).toPromise();
    });
  }

  
  public async edit(event,item){
    event.stopPropagation();
    console.log(item);

    const modal = await this.modalCrl.create({
      component: CrearForumPage,
      // cssClass: 'my-custom-modal-css',
      cssClass: 'my-custom-modal-css-capturas',
      showBackdrop: false,
      componentProps: {item},
      mode: 'ios',
      backdropDismiss: true
    });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
        this.cargar(this.materiaId);
    });
  }

  public permisoEditar() {
    const jwt_temp = localStorage.getItem('USER_INFO_TEMP');
    if(jwt_temp != null)
    {
        return false;
    }
    
    if(this.getKeyToken('tipo')=='Profesor')
      return true;
    else
      return false;
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

  async estadoForo(event, item){
    event.stopPropagation();
    console.log(item);

    const texto = item.Estado === 'Abierto' ? 'cerrar' : 'abrir';

    const alertTerminado = await this.alertController.create({
      header: 'Foro',
      message: 'Está a punto de ' + texto + ' el foro; ¿Está seguro de realizar esta acción?',
      buttons: [
        {
          text: 'No', handler: () =>  {
            return;
          }
        },
        {
          text: 'Si', handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Cambiado estado...'
            });

            await loading.present();

            const estado = await this.apiForum.setEstadoForo(item).toPromise();
            console.log(estado);
            item.Estado = estado['Estado'];

            this.loadingController.dismiss();

            this.alertController.dismiss();
          }
        }
      ]
    });

    alertTerminado.present();
  }

  loadData(event) {
    console.log('loaddata');
    if (this.cargarConFiltro) {

     this.getApiForosConFiltro(event);

   } else {

     this.getApiForosSinFiltro(event);

   }

     }

  async cargandoAnimation(text) {
    this.loading = await this.loadingController.create({
      message: text,
      duration: 60000
    });

    await this.loading.present();
  }

  getApiForosSinFiltro(event) {
    console.log('cargarSinfiltro');
    this.apiForum.getInfinite(this.contadorInfinieScroll, 10).subscribe(data => {
      console.log('getInfinite');
      console.log(data);
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          console.log('dentro');
          this.LstForo.push(data[i]);
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
  getApiForosConFiltro(event) {
    console.log('cargarConfiltro');
    console.log(event);

    this.apiForum.getForosMateriasInfinite(this.materiaId, this.contadorInfinieScroll, 10).subscribe(data => {
      console.log('getInfinite');
      console.log(data);
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          console.log('dentro');
          this.LstForo.push(data[i]);
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
