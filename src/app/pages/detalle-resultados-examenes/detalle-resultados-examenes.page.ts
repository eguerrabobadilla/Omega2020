import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlumnosService } from 'src/app/api/alumnos.service';
import { ExamenesService } from 'src/app/api/examenes.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-detalle-resultados-examenes',
  templateUrl: './detalle-resultados-examenes.page.html',
  styleUrls: ['./detalle-resultados-examenes.page.scss'],
})
export class DetalleResultadosExamenesPage implements OnInit {
  tipoUsuario: any;
  LstAlumnos: any[] = [];
  LstExamenes: any[] = [];
  @Input() item;
  totalEntregadas: number = 0;
  totalPendientes: number = 0;
  loading: any;

  constructor(private globalServicies: GlobalService,private loadingController: LoadingController,
              private apiAlumnos: AlumnosService,private apiExamenes: ExamenesService,private modalCtrl: ModalController) { 

  }

  ngOnInit() {
    this.tipoUsuario=this.globalServicies.getKeyToken("tipo");
    console.log(this.item);
  }

  async ionViewDidEnter() {
    let index;

    if(this.item.Escolaridad=="Kinder") index=1;
    else if(this.item.Escolaridad=="Primaria" || this.item.Escolaridad=="Elementary School") index=2;
    else if(this.item.Escolaridad=="Secundaria" || this.item.Escolaridad=="Junior High School") index=3;
    else if(this.item.Escolaridad=="Preparatoria" || this.item.Escolaridad=="High School") index=4;

    this.loading =await this.loadingController.create({
      //cssClass: 'my-custom-class',
      message: 'Cargando Alumnos...',
      duration: 120000
    });

    this.loading.present();

    //Se manda el id del examen
    this.LstExamenes = await this.apiExamenes.getExamenesAlumnos(this.item.Id).toPromise();
    console.log(this.LstExamenes);

    if(this.item.GrupoIngles=="SI") {
      this.LstAlumnos = await this.apiAlumnos.getAlumnosEscolaridadIngles(index,this.item.Grado,this.item.Grupo).toPromise();
    } else {
      this.LstAlumnos= await this.apiAlumnos.getAlumnosEscolaridad(index,this.item.Grado,this.item.Grupo).toPromise();
    }

    this.LstAlumnos.forEach(element => {
      //console.log(element);
      const userD = this.LstExamenes.filter(l => l.UsuarioId == element.Id);
      console.log(userD);
      if(userD.length > 0) {
            element.status ="Entregado";
            element.Puntaje = userD[0].Puntaje;
            element.Duracion = userD[0].Duracion;
            element.PuntajePorcentaje = userD[0].PuntajePorcentaje;
            this.totalEntregadas +=1;
      } else {
            element.status ="Pendiente"
            this.totalPendientes +=1;
      }
    });

    this.loadingController.dismiss();

  }

  closeModal (){
    console.log("cerar");
    this.modalCtrl.dismiss();
  }

}
