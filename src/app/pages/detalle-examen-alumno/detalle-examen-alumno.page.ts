import { Component, Input, OnInit, ViewChild, ApplicationRef, ElementRef, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { IonSlides, PopoverController, ModalController, LoadingController, IonVirtualScroll, IonBackdrop, AlertController } from '@ionic/angular';
import { PreguntasService } from 'src/app/api/preguntas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ListComponent} from 'src/app/components/list/list.component';
import { CountdownComponent } from 'ngx-countdown';
import { ExamenesService } from 'src/app/api/examenes.service';
import { WebsocketService } from '../../services/websocket.service';






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
  totalPreguntas:any;
  contadorPregunta= 1;
  botonSiguienteDisable=false;
  botonAnteriorDisable=true;
  botonPopoverDisable=false;
  botonIcinicarExamenDisable=false;
  backDropVisible=false;
  examenId:number;
  fechaAplicacionExamen:any;
  respuestaSeleccionada="[sin-respuesta]";
  preguntaAnterior:number;
  textoBoton = 'Siguiente';
  botonHeaderVisible=false;
  instruccionesVisible=false;
  duracionExamen: number;
  banderaslideFinExamen=false;
  headerResultadoVisible=false;
  loading: any;
  estadoClickRelacionar=0;//relacionar
  itemSeleccionadoRelacionar:any;//relacionar
  primerClickRelacionar= true;//relacionar
  coloresSeleccionados=[];
  colores=['red','blue','green','yellow','black','magenta'];

  elementoSeleccionadoRelacionar: any;
  textoInformacionInicioFin:string;
  spiner=false;
  inicioContador=false;
  status = 'start';
  @Input() item;
  @ViewChild('slider', {static: false}) slider: IonSlides;
  @ViewChild('countdown', {static: false}) counter: CountdownComponent;
  @ViewChild("child", {static: false}) child: ElementRef<HTMLElement>;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;
  @ViewChildren('p') componentsp:QueryList<ElementRef>;
  @ViewChildren('r') componentsr:QueryList<ElementRef>;
  @ViewChild('backDrop', {static: false}) ionBackdro: HTMLElement;
  config ={
    demand: false
  };

  slideOpts = {autoHeight: true,initialSlide:0,allowTouchMove: false };

//Variables ejercicio Relacionar
   esRelacionar=true;
   preguntasRelacionar: any[] = [];
   colorDivRelacionar='transparent';

 
  constructor(private apiPreguntas: PreguntasService, public popoverController: PopoverController,private modalCtrl: ModalController,
              private apiExamenes: ExamenesService,private loadingController: LoadingController,private applicationRef: ApplicationRef, private render: Renderer2,
              private alertController: AlertController,public  webSocket: WebsocketService) { }

  ngOnInit() {
      
   }

   ionViewDidEnter() {
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
        this.iniciarExamen(data["tiempoRestante"]);
     }
     else if (data["status"]=="periodoFinalizado"){
      setTimeout(() => {
        this.slider.update;
        this.slider.slideTo(4);
        this.slideOpts={autoHeight: true,initialSlide:4,allowTouchMove: false};
        this.textoInformacionInicioFin="La fecha en la que puedes aplicar este examen ha finalizado. "
        this.fechaAplicacionExamen=data["fechaTerminoExamen"];

       });

     }
     else if(data["status"]=="fueradeTiempo"){
      setTimeout(() => {
        this.slider.update;
        this.slider.slideTo(4);
        this.slideOpts={autoHeight: true,initialSlide:4,allowTouchMove: false};
        this.textoInformacionInicioFin="Este examen se puede iniciar hasta: "
        this.fechaAplicacionExamen=data["fechaAplicacionExamen"];

       });
     
     }
        setTimeout(() => {
          this.spiner=false;
        });
       
  });

  }

   ngAfterViewInit(): void {

   }
  

  async iniciarExamen(duracionExamen){

    this.botonIcinicarExamenDisable=true;

    setTimeout(() => {
      this.botonIcinicarExamenDisable=false;
    },100000);
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
      
  this.apiExamenes.GetExamenInformacion(this.examenId).subscribe(data =>{

        if(duracionExamen==null)this.duracionExamen=this.item.DuracionExamen*60;
        else this.duracionExamen=duracionExamen*60;
        
        this.cambioPregunta("especifico",1);
        console.log("this.item")
       console.log(data)
       console.log(this.examenId)
       this.totalPreguntas= data['TotalPreguntas'];
     },(err) => {
       console.log(err);
     });

  }

  async cambioPregunta(direccion , numero){
   if(this.botonPopoverDisable)return; // solocion para IOS ya que en las ipad no respeta el disable y dejaba avanzar; causaba mucho problemas
  //  if(this.contadorPregunta==5-1)this.slider.slidePrev();
  
     this.getStatusExamenSiguientePregunta();
    this.preguntaAnterior=this.contadorPregunta;
    if (this.respuestaSeleccionada=="")this.respuestaSeleccionada="[sin-respuesta]";

    if (direccion==="siguiente"){
        if(this.contadorPregunta==this.totalPreguntas && this.banderaslideFinExamen==false){
          this.slider.slideNext();
          this.botonSiguienteDisable=true
          this.banderaslideFinExamen=true;
          
          } else  this.contadorPregunta++;
          
    }
    
    if (direccion==="anterior"){
      if(this.contadorPregunta==this.totalPreguntas && this.banderaslideFinExamen==true){
        this.slider.slidePrev();
        this.preguntaAnterior=this.totalPreguntas;
        this.banderaslideFinExamen=false;
        this.botonSiguienteDisable=false;
      }else
      this.contadorPregunta--;
      
    }

    if (direccion==="especifico"){
      if(this.contadorPregunta==this.totalPreguntas && this.banderaslideFinExamen==true){
        this.slider.slidePrev();
        this.preguntaAnterior=this.totalPreguntas;
        this.banderaslideFinExamen=false;
        this.botonSiguienteDisable=false;
      }
      this.contadorPregunta=numero;
      

    }

    if(this.contadorPregunta==1)this.botonAnteriorDisable=true;else this.botonAnteriorDisable = false;
    
    setTimeout(() => {
      this.spiner=true;
    });
    this.botonAnteriorDisable=true;  //los pongo disable antes de la peticion para bloquearlos
    this.botonSiguienteDisable=true; //los pongo disable antes de la peticion para bloquearlos
    this.botonPopoverDisable=true; //los pongo disable antes de la peticion para bloquearlos
    this.backDropVisible=true; //los pongo disable antes de la peticion para bloquearlos
    this.colores=['red','blue','green','yellow','black','magenta'];

    this.apiPreguntas.getPreguntaExamen(this.examenId,this.contadorPregunta,this.preguntaAnterior,this.respuestaSeleccionada).subscribe(data =>{
      this.preguntaInfo = data;

     // si es ejercicio relacionar
     if(data['TipoPregunta']=='relacionarPreguntas'){
      this.exercicioRelacionar(data);
      this.esRelacionar=true;
     }
     else{
      this.esRelacionar=false;
      this.exercicioUnaSolaRespuesta(data);
     } 
 
      
      setTimeout(() => {

        setTimeout(() => {
          this.applicationRef.tick();
          this.spiner=false;
          this.slider.update;
         // this.slider.slideTo(1);
          this.slideOpts={autoHeight: true,initialSlide:4,allowTouchMove: false};
          
          this.virtualScroll.checkEnd();
          this.slider.updateAutoHeight();

          
          if(this.banderaslideFinExamen==true)this.botonSiguienteDisable=true;
          else this.botonSiguienteDisable=false ;
          if(this.contadorPregunta==1)this.botonAnteriorDisable=true;else this.botonAnteriorDisable = false;
          this.botonPopoverDisable=false;
          this.backDropVisible=false;

        }, 1000);
       
        
      });
    },error => {
      console.log(error);
      this.mensajeConexionLenta();
    });

 
    
/*if(this.contadorPregunta==this.item.TotalPreguntas){
      this.botonSiguienteDisable=true
      this.slider.slideNext();
    }else this.botonSiguienteDisable=false;*/

      
  }

  async mensajeConexionLenta(){

    try  {

      const alertTerminado = await this.alertController.create({
        header: 'Conexión lenta',
        message: 'Estas conectado a una red wifi inestable, favor de conectarse a una red estable para una mejor experiencia de uso. ',
        backdropDismiss :false,
        buttons: [
          {
            text: 'Entendido', handler: () =>  {
              this.closeModal();
              return;
            }
          }
        ]
      });

      alertTerminado.present();
    } catch(err) {


    }
      
  }
  imagenLeida(){
    console.log('leido')
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


      this.headerResultadoVisible=true;
      this.slider.slideTo(3);
      this.botonHeaderVisible=false;
      setTimeout(() => {
        this.spiner=true;
      });
//      this.resultadoExamen= await this.apiExamenes.examenTerminado(this.item.Id,this.item).toPromise();

      this.apiExamenes.examenTerminado(this.item.Id,this.item).subscribe(data  =>  {
          this.resultadoExamen=data;
          setTimeout(() => {
            this.spiner=false;
            this.slider.update;
            this.slider.slideTo(3);
            this.slideOpts={autoHeight: true,initialSlide:4,allowTouchMove: false};
            
            setTimeout(() => {
              this.virtualScroll.checkEnd();
              this.slider.updateAutoHeight();
            }, 500);
            
          });
      },error =>{
        console.log(error['error']);
        this.presentAlert(error['error']);
      });
    } catch (error) {
      console.error(error);

    }
   
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'LBS Plus',
      //subHeader: 'Subtitle',
      message: msg,
      mode: 'ios',
      buttons: ['Aceptar']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  eventCountdown(event){
    console.log(event)
        if(this.counter && this.inicioContador==false){
          //console.log("dentro del if")
          this.inicioContador=true;
        }
       if(event.status==3 && this.inicioContador ){
         //console.log("finalizo el reloj")
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
          numerovueltas: this.totalPreguntas,
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


  exercicioRelacionar(data: any[]){

    this.preguntasRelacionar=data['Preguntas'];
    this.respuestas= data['Respuestas'];
setTimeout(() => {
  data['Preguntas'].forEach(element => {

    if(element.Relacionado!='NO'){
      this.render.setStyle(this.componentsr.toArray()[element.Relacionado-1].nativeElement,'border','solid 5px');
      this.render.setStyle(this.componentsp.toArray()[element.index.charAt(0)-1].nativeElement,'border','solid 5px');
      this.render.setStyle(this.componentsr.toArray()[element.Relacionado-1].nativeElement,'border-color',element.Background);
      this.render.setStyle(this.componentsp.toArray()[element.index.charAt(0)-1].nativeElement,'border-color',element.Background);

      let indexEliminar=this.colores.indexOf(element.Background);
      this.colores.splice(indexEliminar,1);
    //  if(indexEliminar)
   //   

      
    }

  });

}, 600);
 
  }

  exercicioUnaSolaRespuesta(data: any[]){
    this.respuestaSeleccionada=data['RespuestaAlumno'];
    this.respuestas= data['Respuestas'];
  }

  clickEjercicioRelacionar(element,item,index){

    let derechoIdRelacionado;
    let izquierdoIdRelacionado;
    //1.- si da click en la imagen, le indico que el elemento va hacer el div padre de la imagen
    if(element.target.tagName==='IMG')element=element.path[2];
    else element=element.target;
  
    if(this.estadoClickRelacionar==0){

      if(this.primerClickRelacionar){
        this.itemSeleccionadoRelacionar=item;
        this.elementoSeleccionadoRelacionar=element;
      }

       if(item.Relacionado !== 'NO'){//si ya esta relacionado elimino la relacion
        //console.log("element.style")
        //console.log(element.style)
          this.colores.push(element.style.borderColor);
          this.render.removeStyle(element,'border');
          this.render.removeStyle(element,'border-color');

        if(item.lado=='derecho'){
          this.render.removeStyle(this.componentsp.toArray()[item.Relacionado-1].nativeElement,'border');
          this.render.removeStyle(this.componentsp.toArray()[item.Relacionado-1].nativeElement,'border-color');
          derechoIdRelacionado=this.preguntasRelacionar[item.Relacionado-1].Relacionado;
          izquierdoIdRelacionado=item.Relacionado;
           this.preguntasRelacionar[item.Relacionado-1].Relacionado='NO'
        }
        if(item.lado=='izquierdo'){
          
          this.render.removeStyle(this.componentsr.toArray()[item.Relacionado-1].nativeElement,'border');
          this.render.removeStyle(this.componentsr.toArray()[item.Relacionado-1].nativeElement,'border-color');
          izquierdoIdRelacionado=this.respuestas[item.Relacionado-1].Relacionado;
          derechoIdRelacionado=item.Relacionado;
          this.respuestas[item.Relacionado-1].Relacionado='NO'
        }
                //eliminar la relacion en la base datoos
              let objDeleteRelacionar={
                  examenId: this.examenId,
                  indexPregunta : this.contadorPregunta,
                  IdRelacionadoDerecho : izquierdoIdRelacionado ,
                  IdRelacionadoIzquierdo : derechoIdRelacionado ,
                 // ColorRelacionado : colorRelacionado
          
          
                }
        

        this.apiPreguntas.deleteRelacionarPregunta(objDeleteRelacionar).subscribe(data  =>{
  
        });
  
        item.Relacionado='NO'
         
        return;
       }

        this.itemSeleccionadoRelacionar=item;
        this.elementoSeleccionadoRelacionar=element;
        this.colorDivRelacionar=this.coloresRelacionar();
        this.render.setStyle(element,'border','solid 5px');
        this.render.setStyle(element,'border-color',this.colorDivRelacionar);
        this.estadoClickRelacionar=1;

    }
    else if(this.estadoClickRelacionar==1){

      if(item.lado == this.itemSeleccionadoRelacionar.lado && (element.style.borderColor==''|| element.style.borderColor=='initial') ){//si selecciona una de la misma columna
        this.colores.push(this.elementoSeleccionadoRelacionar.style.borderColor);
        this.itemSeleccionadoRelacionar=item;
        this.colorDivRelacionar=this.coloresRelacionar();
        this.render.setStyle(element,'border','solid 5px');
        this.render.setStyle(element,'border-color',this.colorDivRelacionar);
        this.render.removeStyle(this.elementoSeleccionadoRelacionar,'border');
        this.render.removeStyle(this.elementoSeleccionadoRelacionar,'border-color');
        this.elementoSeleccionadoRelacionar=element;
        this.estadoClickRelacionar=1;

      }

      if(item.lado != this.itemSeleccionadoRelacionar.lado && (element.style.borderColor==''|| element.style.borderColor=='initial')){
        let colorRelacionado=this.colorDivRelacionar;
        this.render.setStyle(element,'border','solid 5px');
        this.render.setStyle(element,'border-color',colorRelacionado);
        item.Relacionado=this.itemSeleccionadoRelacionar.index.charAt(0);
        this.itemSeleccionadoRelacionar.Relacionado=item.index.charAt(0);
        var Id1=this.itemSeleccionadoRelacionar.Id.charAt(0);
        var Id2=item.Id.charAt(0);
        this.estadoClickRelacionar=0;
        let ladoDerechoRelacionado = item.lado=='derecho' ? item.Relacionado : this.itemSeleccionadoRelacionar.Relacionado;
        let ladoIzquierdoRelacionado = item.lado=='izquierdo' ? item.Relacionado : this.itemSeleccionadoRelacionar.Relacionado;
        let objSaveRelacionar={
          examenId: this.examenId,
          indexPregunta : this.contadorPregunta,
          IdRelacionadoDerecho : ladoDerechoRelacionado,
          IdRelacionadoIzquierdo : ladoIzquierdoRelacionado,
          ColorRelacionado : colorRelacionado


        }
        console.log(objSaveRelacionar)
        this.apiPreguntas.saveRelacionarPregunta(objSaveRelacionar).subscribe(data  =>{

        });

      }

      this.primerClickRelacionar=false;
      
    }

  }

  coloresRelacionar():string{

      
      let numRandmom;
      numRandmom=Math.floor(Math.random() * this.colores.length);
      let colorSeleccionado=this.colores[numRandmom];
      this.colores.splice(numRandmom, 1);

    return colorSeleccionado;

  }



}
