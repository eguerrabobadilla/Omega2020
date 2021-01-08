import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, PopoverController, ModalController } from '@ionic/angular';
import { PreguntasService } from 'src/app/api/preguntas.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ListComponent} from 'src/app/components/list/list.component';
import { CountdownComponent } from 'ngx-countdown';




@Component({
  selector: 'app-detalle-examen-alumno',
  templateUrl: './detalle-examen-alumno.page.html',
  styleUrls: ['./detalle-examen-alumno.page.scss'],
})
export class DetalleExamenAlumnoPage implements OnInit {


  public FrmItem: FormGroup;
  respuestas: any[] = [];
  preguntaInfo: any[] = [];
  contadorPregunta= 1;
  botonSiguienteDisable=false;
  botonAnteriorDisable=true;
  examenId:number;
  respuestaSeleccionada="[sin-respuesta]";
  preguntaAnterior:number;
  textoBoton = 'Siguiente';
  botonHeaderVisible=false;
  botonIniciarVisible=true;
  headerInstruccionesVisible=true;
  duracionExamen: number= 0;
  banderaslideFinExamen=false;
  headerResultadoVisible=false;
  status = 'start';
  @Input() item;
  @ViewChild('slider', {static: false}) slider: IonSlides;
  @ViewChild('countdown', {static: false}) counter: CountdownComponent;
  config ={
    demand: true,
    leftTime: 30
  };

  slideOpts = {autoHeight: true,allowTouchMove: false };


 
  constructor(private apiPreguntas: PreguntasService, public popoverController: PopoverController,private modalCtrl: ModalController) { }

  ngOnInit() {
  //  this.duration = 3600; // test

     // test
     console.log(this.item)
   }

  

  iniciarExamen(){
    
    //this.slider.slideNext();
    this.headerInstruccionesVisible=false;
    this.examenId=this.item.Id;
    this.botonIniciarVisible=false;
    this.botonHeaderVisible=true;
    setTimeout(() => {
      this.slider.slideNext();
    }, 100);
   
    this.apiPreguntas.getExamen(this.examenId).subscribe(data =>{
      console.log("inicio")
      this.duracionExamen=2400;
    //  this.config.leftTime=2400;
     // this.counter.left=2400;
      
      //this.counter.config.leftTime=2400;
    //  this.counter.restart();
      this.counter.begin();
      
      this.cambioPregunta("especifico",1);
   });


  }

  cambioPregunta(direccion , numero){
    console.log(direccion)
    console.log(numero)

  //  if(this.contadorPregunta==5-1)this.slider.slidePrev();
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
    this.apiPreguntas.getPreguntaExamen(this.examenId,this.contadorPregunta,this.preguntaAnterior,this.respuestaSeleccionada).subscribe(data =>{
      this.preguntaInfo = data;
      this.respuestaSeleccionada=data['RespuestaAlumno'];
      this.respuestas= data['Respuestas'];
    });
     console.log(this.contadorPregunta)
/*if(this.contadorPregunta==this.item.TotalPreguntas){
      this.botonSiguienteDisable=true
      this.slider.slideNext();
    }else this.botonSiguienteDisable=false;*/

      
  }

  preguntaFinalizarExamen(){
    console.log("slideNext")
    this.headerResultadoVisible=true;
    this.slider.slideNext();
    this.botonHeaderVisible=false;
    this.slider.updateAutoHeight();
  }

  eventCountdown(event){
     
       if(event.status==3){
        console.log("done")
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
