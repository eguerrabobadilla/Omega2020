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
    if(event.detail.value.length < 4) return;

    this.textoBuscar = event.detail.value;
    this.contadorInfinieScroll=0;
    this.apiUsuarios.getUsuarios(this.textoBuscar,this.contadorInfinieScroll,100).subscribe(data => {
      if(data.length!=0) {
        this.LstUsuario = data;
        console.log(this.LstUsuario);
        this.contadorInfinieScroll += 100;
        console.log(this.contadorInfinieScroll);
      }
    });
  }
  
  cargar() {
    this.apiUsuarios.getUsuarios(this.textoBuscar,this.contadorInfinieScroll,100).subscribe(data => {
 
      if(data.length!=0) {
        console.log(data.length);

        /*this.LstUsuarioTemp = this.LstUsuario;
        this.LstUsuarioTemp.push(data);
        this.LstUsuario = this.LstUsuarioTemp;*/
        
        this.LstUsuario.push(data);
        setTimeout(() => {
          console.log("this.applicationRef.tick()");
          this.applicationRef.tick();  
        }, 500);
        
        console.log(this.LstUsuario);
        this.contadorInfinieScroll += 100;
        console.log(this.contadorInfinieScroll);
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
    console.log(event);
    event.target.complete();
    this.cargar();  
  }

}
