import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DocentesService } from 'src/app/api/docentes.service';
import { DetalleAlumnoPage } from 'src/app/pages/detalle-alumno/detalle-alumno.page';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.scss'],
})
export class DocentesComponent implements OnInit {
  @Output() backPage = new EventEmitter();
  @Input() data;
  LstDocentes: any[] = [];
  loading: any;

  constructor(private apiDocentes: DocentesService,public loadingController: LoadingController,
    private modalCtrl: ModalController) { 

  }

  ngAfterViewInit() {
    this.cargar();
  }

  ngOnInit() {}

  async cargar() {

    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    this.apiDocentes.getDocentesGrupo(this.data.index,this.data.Grado,this.data.Grupo).subscribe(data =>{
      this.LstDocentes= data;
      this.loadingController.dismiss();
    });
  }

  async verDocente(item) {
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
