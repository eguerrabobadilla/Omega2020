import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { AlumnosService } from 'src/app/api/alumnos.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { DetalleAlumnoPage } from 'src/app/pages/detalle-alumno/detalle-alumno.page';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss'],
})
export class AlumnosComponent implements OnInit {
  @Output() backPage = new EventEmitter();
  @Input() data;
  LstAlumnos: any[] = [];
  loading: any;

  constructor(private apiAlumnos: AlumnosService,public loadingController: LoadingController,
              private modalCtrl: ModalController) {

  }

  ngAfterViewInit() {
    this.cargar();
  }

  async cargar() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    this.apiAlumnos.getAlumnosEscolaridad(this.data.index,this.data.Grado,this.data.Grupo).subscribe(data =>{
      this.LstAlumnos= data;
      this.loadingController.dismiss();
    });
  }

  ngOnInit() {}

  async verAlumno(item) {
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

  back() {
    this.backPage.emit(this.data);
  }

}
