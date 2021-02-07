import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import { NewsService } from '../../api/news.service';
import { DetallesNewsPage } from 'src/app/pages/detalles-news/detalles-news.page';
import { AlertController, LoadingController, ModalController, IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { CrearNewsPage } from 'src/app/pages/crear-news/crear-news.page';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  LstNoticias: any[] = [];
  loading: any;
  contadorInfinieScroll = 0;
  spiner = true;
  @Output() updateAutoHeightSlider = new EventEmitter();
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;

  constructor(private apiNoticias: NewsService, private modalCrl: ModalController,private loadingController: LoadingController,
              private alertController: AlertController) { }

  ngOnInit() {
    //this.cargar();
    this.apiNoticias.getInfinite(this.contadorInfinieScroll, 10).subscribe(data => {
      this.LstNoticias = data;
      this.contadorInfinieScroll += 10;
      
      setTimeout(() => {
        this.updateAutoHeightSlider.emit();
      }, 300);

      this.spiner =false;
    });
  }

  public permisoEditar() {
    const jwt_temp = localStorage.getItem('USER_INFO_TEMP');
    if (jwt_temp != null) {
        return false;
    }

    if (this.getKeyToken('tipo') == 'Director') {
      return true;
    }
    else {
      return false;
    }
  }
  
  public cargar() {

    this.apiNoticias.get().subscribe(data =>{
      this.LstNoticias = data;

      setTimeout(() => {
        this.updateAutoHeightSlider.emit();
      }, 300);
      //console.log('this.LstNoticias yeah');
      //console.log(this.LstNoticias);
    });
  }
  async openDetail(event: Event, item) {

    const modal = await this.modalCrl.create({
        component: DetallesNewsPage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        showBackdrop: true,
        componentProps: {item}
      });
      
      return await modal.present();
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

  async cargandoAnimation(text) {
    this.loading = await this.loadingController.create({
      message: text,
      duration: 60000
    });

    await this.loading.present();
  }

  public async eliminar(event, item) {
    event.stopPropagation();
    console.log(item);

    const alertTerminado = await this.alertController.create({
      header: 'ELIMINAR',
      message: '¿Está seguro de ELIMINAR la noticia?',
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

            await this.apiNoticias.delete(item.Id).toPromise();

            this.LstNoticias = this.LstNoticias.filter(obj => obj !== item);

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
     this.getApiNoticiasSinFiltro(event);
  }

  getApiNoticiasSinFiltro(event) {
    console.log('cargarSinfiltro');
    this.apiNoticias.getInfinite(this.contadorInfinieScroll, 10).subscribe(data => {
      console.log('getInfinite');
      console.log(data);
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          console.log('dentro');
          this.LstNoticias.push(data[i]);
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

  public async edit(event, item) {
    event.stopPropagation();

    const modal = await this.modalCrl.create({
      component: CrearNewsPage,
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
            this.LstNoticias = await this.apiNoticias.get().toPromise();
            this.loadingController.dismiss();
        }
    });
  }

}
