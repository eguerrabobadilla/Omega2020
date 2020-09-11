import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AngularDelegate, LoadingController, AlertController } from '@ionic/angular';
import { CrearTopicPage } from '../crear-topic/crear-topic.page';
import { CalendarioService } from 'src/app/api/calendario.service';

@Component({
  selector: 'app-detalles-calendar',
  templateUrl: './detalles-calendar.page.html',
  styleUrls: ['./detalles-calendar.page.scss'],
})
export class DetallesCalendarPage implements OnInit {
  @Input() item;
  banderaEdito: boolean=false;


  constructor(private modalCtrl: ModalController,private apiCalendario: CalendarioService,public loadingController: LoadingController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
   // console.log("input")
    if(this.item.Escolaridad == 'Elementary School' || this.item.Escolaridad=='Primaria')
      this.item.Escolaridad="Primaria"
    else if(this.item.Escolaridad == 'Junior High School' || this.item.Escolaridad=='Junior High School')
      this.item.Escolaridad="Secundaria"
    else if(this.item.Escolaridad == 'High School' || this.item.Escolaridad=='High School')
      this.item.Escolaridad="Preparatoria"
    else if(this.item.Escolaridad == 'Kinder' || this.item.Escolaridad=='Kinder')
      this.item.Escolaridad="Kinder"
  }

  closeModal(){
    if(this.banderaEdito==true)
      this.modalCtrl.dismiss(this.item);
    else
      this.modalCtrl.dismiss();
  }

  async edit() {
    //console.log(this.item);

    const item=this.item;

    const modal = await this.modalCtrl.create({
      component: CrearTopicPage,
      cssClass: 'my-custom-modal-css',
      mode: 'ios',
      backdropDismiss: true,
      componentProps: {item}
    });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
      //this.LstForo = await this.apiForum.get(false, 0).toPromise();
      console.log(data);
      if(data.data != undefined) {
          this.item = data.data;
          this.banderaEdito=true;
      }
    });
  }

  public permisoEditar() {
    if(this.getKeyToken('tipo')=='Profesor' && this.item.Tipo=='Tema')
      return true;
    else
      return false;
  }

  public async eliminar() {
    console.log(this.item);

    const alertTerminado = await this.alertCtrl.create({
      header: 'ELIMINAR',
      message: '¿Está seguro de ELIMINAR el evento?',
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
        
            await this.apiCalendario.deleteEvento('Tema',this.item.RecursoId).toPromise();

            this.banderaEdito=true;

            this.loadingController.dismiss();

            this.closeModal();
          }
        }
      ]
    });

    alertTerminado.present();
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
}
