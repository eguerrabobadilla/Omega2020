import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, PopoverController, ModalController, LoadingController } from '@ionic/angular';
import { PreguntasService } from 'src/app/api/preguntas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ListComponent} from 'src/app/components/list/list.component';
import { CountdownComponent } from 'ngx-countdown';
import { ExamenesService } from 'src/app/api/examenes.service';




@Component({
  selector: 'app-detalle-examen-alumno',
  templateUrl: './detalle-examen-alumno.page.html',
  styleUrls: ['./detalle-examen-alumno.page.scss'],
})
export class DetalleExamenAlumnoPage implements OnInit {


  public FrmItem: FormGroup;
  respuestas: any[] = [];
  preguntaInfo: any[] = [];
  resultadoExamen: any;
  contadorPregunta= 1;
  botonSiguienteDisable=false;
  botonAnteriorDisable=true;
  examenId:number;
  respuestaSeleccionada="[sin-respuesta]";
  preguntaAnterior:number;
  textoBoton = 'Siguiente';
  botonHeaderVisible=false;
  //botonIniciarVisible=true;
  instruccionesVisible=false;
  duracionExamen: number;
  banderaslideFinExamen=false;
  headerResultadoVisible=false;
  loading: any;
  spiner=false;
  inicioContador=false;
  status = 'start';
  @Input() item;
  @ViewChild('slider', {static: false}) slider: IonSlides;
  @ViewChild('countdown', {static: false}) counter: CountdownComponent;
  config ={
    demand: false
  };

  slideOpts = {autoHeight: true,allowTouchMove: false };


 
  constructor(private apiPreguntas: PreguntasService, public popoverController: PopoverController,private modalCtrl: ModalController,
              private apiExamenes: ExamenesService,private loadingController: LoadingController) { }

  ngOnInit() {
 
   }

   ngAfterViewInit(): void {
     //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
     //Add 'implements AfterViewInit' to the class.
      setTimeout(() => {
        this.spiner=true;
      });
     
     this.apiPreguntas.getStatusExamen(this.item.Id).subscribe(data  =>{

      if(data == null || data["status"]=="Iniciado"){
        this.instruccionesVisible=true;
      }
       else if(data["status"]=="Finalizado"){// si el examen esta en estatus finalizado lo manda al resultado final del examen  al tercer slide
            this.preguntaFinalizarExamen();
          }

          else if(data["status"]=="Proceso"){
            console.log(data)
              this.iniciarExamen(data["tiempoRestante"]);

          }
          setTimeout(() => {
            this.spiner=false;
          });
         
    });

     
   }
  

  async iniciarExamen(duracionExamen){


    setTimeout(() => {
      this.spiner=true;
    });
    //this.slider.slideNext();
    this.instruccionesVisible=false;
    this.examenId=this.item.Id;
  //  this.botonIniciarVisible=false;
    this.botonHeaderVisible=true;
    setTimeout(() => {
      this.slider.slideNext();
    }, 100);
      
  this.apiPreguntas.getExamen(this.examenId).subscribe(data =>{
    console.log("DURACION EXAMEN")
    console.log(duracionExamen)
        if(duracionExamen==null)this.duracionExamen=this.item.DuracionExamen*60;
        else this.duracionExamen=duracionExamen*60;
        
        this.cambioPregunta("especifico",1);
       

     },(err) => {
       console.log(err);
     });

  }

  async cambioPregunta(direccion , numero){
   // console.log(direccion)
   // console.log(numero)

  //  if(this.contadorPregunta==5-1)this.slider.slidePrev();
     this.getStatusExamenSiguientePregunta();
    this.preguntaAnterior=this.contadorPregunta;
    if (this.respuestaSeleccionada=="")this.respuestaSeleccionada="[sin-respuesta]";

    if (direccion==="siguiente"){
        if(this.contadorPregunta==this.item.TotalPreguntas){
          this.slider.slideNext();
          this.botonSiguienteDisable=true
          this.banderaslideFinExamen=true;
          
          } else  this.contadorPregunta++;
          
    }
    
    if (direccion==="anterior"){
      if(this.contadorPregunta==this.item.TotalPreguntas && this.banderaslideFinExamen==true){
        this.slider.slidePrev();
        this.preguntaAnterior=this.item.TotalPreguntas;
        this.banderaslideFinExamen=false;
        this.botonSiguienteDisable=false;
      }else
      this.contadorPregunta--;
      
    }

    if (direccion==="especifico"){
      if(this.contadorPregunta==this.item.TotalPreguntas && this.banderaslideFinExamen==true){
        this.slider.slidePrev();
        this.preguntaAnterior=this.item.TotalPreguntas;
        this.banderaslideFinExamen=false;
        this.botonSiguienteDisable=false;
      }
      this.contadorPregunta=numero;
      

    }

    if(this.contadorPregunta==1)this.botonAnteriorDisable=true;else this.botonAnteriorDisable = false;
    
    setTimeout(() => {
      this.spiner=true;
    });

    this.apiPreguntas.getPreguntaExamen(this.examenId,this.contadorPregunta,this.preguntaAnterior,this.respuestaSeleccionada).subscribe(data =>{
      this.preguntaInfo = data;
      this.respuestaSeleccionada=data['RespuestaAlumno'];
      this.respuestas= data['Respuestas'];

      this.spiner=false;
    },error => {
      console.log(error);
      
    });

     console.log(this.contadorPregunta)
/*if(this.contadorPregunta==this.item.TotalPreguntas){
      this.botonSiguienteDisable=true
      this.slider.slideNext();
    }else this.botonSiguienteDisable=false;*/

      
  }

  getStatusExamenSiguientePregunta(){
    this.apiPreguntas.getStatusExamen(this.item.Id).subscribe(data  =>{
     
  
         if(data["status"]=="Finalizado"){
            this.preguntaFinalizarExamen();
          }

    });
   
  }

  async preguntaFinalizarExamen(){
    try {

      console.log("slideNext")
      this.headerResultadoVisible=true;
      this.slider.slideTo(3);
      this.botonHeaderVisible=false;
      setTimeout(() => {
        this.spiner=true;
      });
      this.resultadoExamen= await this.apiExamenes.examenTerminado(this.item.Id,this.item).toPromise();
      this.slider.updateAutoHeight();
      this.spiner=false;
      console.log(this.resultadoExamen);
      
    } catch (error) {
      console.error(error);

    }
   
  }

  eventCountdown(event){
    console.log(event)
        if(this.counter && this.inicioContador==false){
          console.log("dentro del if")
          this.inicioContador=true;
        }
       if(event.status==3 && this.inicioContador ){
         console.log("finalizo el reloj")
          this.preguntaFinalizarExamen();

       }
  }

  async abrirPopover(ev: any){
 
      const popover = await this.popoverController.create({
        component: ListComponent,
        cssClass: 'my-custom-class',
        event: ev,
        translucent: false,
        componentProps: {
          numerovueltas: this.item.TotalPreguntas,
          onClick: (number) => {
            popover.dismiss();
            this.cambioPregunta('especifico',number);
          }
        },
      });
      return await popover.present();

  }

  closeModal(){
      this.modalCtrl.dismiss();
  }



}
