import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import { GruposService } from 'src/app/api/grupos.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-grupos-docentes',
  templateUrl: './grupos-docentes.component.html',
  styleUrls: ['./grupos-docentes.component.scss'],
})
export class GruposDocentesComponent implements OnInit {
  @Output() detail = new EventEmitter();
  @Output() backPage = new EventEmitter();
  @Output() updateAutoHeightSlider = new EventEmitter();
  @Input() data;
  LstGrupos: any[] = [];
  loading: any;

  constructor(private apiGrupos: GruposService,public loadingController: LoadingController) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.cargar();
  }

  async cargar() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    this.apiGrupos.getGruposEscolaridadDocentes(this.data.index).subscribe(data =>{
      this.LstGrupos= data;
      this.loadingController.dismiss();

      setTimeout(() => {
        this.updateAutoHeightSlider.emit();
      }, 300);
      
    });
  }

  verAlumnos(item) {
    setTimeout(() => {
      this.detail.emit(item);
    }, 200);
  }

  back() {
      this.backPage.emit();
  }

}
