import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuariosService } from 'src/app/api/usuarios.service';
import { DetalleAlumnoPage } from 'src/app/pages/detalle-alumno/detalle-alumno.page';

@Component({
  selector: 'app-buscar-usuarios',
  templateUrl: './buscar-usuarios.component.html',
  styleUrls: ['./buscar-usuarios.component.scss'],
})
export class BuscarUsuariosComponent implements OnInit {
  value:any;
  textoBuscar: any;
  LstUsuario: any[] = [];
  LstUsuarioTemp: any[] = [];
  contadorInfinieScroll: number = 0;

  constructor(private apiUsuarios: UsuariosService,private modalCtrl: ModalController, private applicationRef: ApplicationRef) {

  }

  ngOnInit() {}

  ionChange(event) {
    this.LstUsuario = [];

    if(event.detail.value.length < 4) return;

    this.textoBuscar = event.detail.value;
    this.contadorInfinieScroll=0;
    this.apiUsuarios.getUsuarios(this.textoBuscar,this.contadorInfinieScroll,100).subscribe(data => {
      if(data.length!=0) {
        this.LstUsuario = data;
        this.contadorInfinieScroll += 100;
      }
    });
  }

  async verUsuario(item) {
    const modal = await this.modalCtrl.create({
      component: DetalleAlumnoPage,
      cssClass: 'my-custom-modal-css-capturas',
      showBackdrop: false,
      componentProps: {item},
      mode: 'ios',
      backdropDismiss: true
    });

    await modal.present();
  }

  loadData(event) {
    this.apiUsuarios.getUsuarios(this.textoBuscar,this.contadorInfinieScroll,100).subscribe(data => {
 
      if(data.length!=0) {
        for (let i = 0; i < data.length; i++) {
          this.LstUsuario.push(data[i]);
        }

        event.target.complete();

        this.contadorInfinieScroll += 100;
      }
      else {
        console.log("fin scroll");
        event.target.disabled = true;
      }
    });
  }

}