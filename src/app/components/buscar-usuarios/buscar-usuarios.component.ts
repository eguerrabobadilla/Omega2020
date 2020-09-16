import { Component, OnInit } from '@angular/core';
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

  constructor(private apiUsuarios: UsuariosService,private modalCtrl: ModalController) {

  }

  ngOnInit() {}

  ionChange(event) {
    if(event.detail.value.length < 4) return;

    this.apiUsuarios.getUsuarios(event.detail.value).subscribe(data => {
        this.LstUsuario = data;
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

}
