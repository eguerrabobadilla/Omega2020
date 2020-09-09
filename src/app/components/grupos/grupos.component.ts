import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import { GruposService } from 'src/app/api/grupos.service';
import { runInThisContext } from 'vm';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss'],
})
export class GruposComponent implements OnInit {
  @Output() detail = new EventEmitter();
  @Output() backPage = new EventEmitter();
  @Input() data;
  LstGrupos: any[] = [];
  loading: any;

  constructor(private apiGrupos: GruposService,public loadingController: LoadingController) {

  }

  ngOnInit() {
    console.log(this.data);
  }

  ngAfterViewInit() {
    this.cargar();
  }

  async cargar() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    this.apiGrupos.getGruposEscolaridad(this.data.index).subscribe(data =>{
      this.LstGrupos= data;
      this.loadingController.dismiss();
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
