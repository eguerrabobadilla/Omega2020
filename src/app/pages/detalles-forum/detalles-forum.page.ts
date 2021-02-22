import { Component, OnInit, Input, ChangeDetectorRef, ApplicationRef, ViewChild, NgZone, ElementRef } from '@angular/core';
import { ModalController, IonVirtualScroll, ActionSheetController, IonItemSliding, AnimationController, Animation, IonTextarea, IonContent } from '@ionic/angular';
import { ForumService } from '../../api/forum.service';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { WebsocketService } from '../../services/websocket.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-detalles-forum',
  templateUrl: './detalles-forum.page.html',
  styleUrls: ['./detalles-forum.page.scss'],
})
export class DetallesForumPage implements OnInit {
  @Input() item;
  lado:string;
  nombre:string;
  mensaje:string;
  responder= false;
  private mutationObserver: MutationObserver;
  classresponder:string;
  @ViewChild('chatList', {read: ElementRef, static: true}) chatList: ElementRef;
  public FrmItem: FormGroup;
  LstForo: any[];
  detalleId: number;
  tipoUsuario: any;
  usuarioId:any;
  @ViewChild('virtualScroll', {static: false}) virtualScroll: IonVirtualScroll;
  @ViewChild('slidingItem', {static: false}) slidingItem: IonItemSliding;
  @ViewChild('toolbar1', {read: ElementRef, static: true}) toolbar1: ElementRef;
  @ViewChild('input', {static: false}) input: IonTextarea;
  @ViewChild('Content', {static: true}) contentArea: IonContent;



  constructor(private apiForum: ForumService, private modalCtrl: ModalController, private  formBuilder : FormBuilder,
              private applicationRef: ApplicationRef,private webSocket: WebsocketService, private _ngZone: NgZone,
              private actionSheetController: ActionSheetController,private animationCtrl: AnimationController,private globalServicies: GlobalService) {
    this.FrmItem = formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required])]
    });

    this.subscribeToEvents();
  }

  ngOnInit() {
    this.tipoUsuario=this.globalServicies.getKeyToken("tipo");
    this.usuarioId=this.globalServicies.getKeyToken("id");
    
    this.mutationObserver = new MutationObserver((mutations) => {
        this.contentArea.scrollToBottom();
    });


    this.detalleId = this.item.foroId;
    this.detalleId = this.item.Id;
    this.responder= false;
    this.classresponder='display-none';

    //Me uno al grupo
    this.webSocket.AddToGroup(`foro-${this.detalleId}`);

    this.apiForum.get(true,this.detalleId).subscribe(data => {
      this.LstForo = data;
    });
  }

  async ngAfterViewInit() {
    const estado = this.item.Estado === 'Abierto' ? false : true;
    this.input.disabled = estado;
    if(estado===true)
      this.input.value = 'Foro Cerrado';
  }
    
  async ionViewDidEnter() { 

    if(this.tipoUsuario=="Alumno")
    {
      this.apiForum.updateAcceso(this.item.Id).toPromise();
      if(this.item.Forosusuarios.length > 0)
        this.item.Forosusuarios[0].Visto='SI';
    }
  }

  async votar(item) {
    console.log(item);
    const tipoVoto =await this.apiForum.addVoto(item.Id).toPromise();
    if(tipoVoto['tipoVoto'] == "positivo")
      item.Votos += 1;
    else
      item.Votos -= 1;
  }

  closeModal() {
      this.modalCtrl.dismiss();
  }

  async enviarMensaje() {

  //  console.log(this.FrmItem.value);
    this.item = this.FrmItem.value;
    if(this.item.mensaje==='') return;

    this.FrmItem.patchValue({
      mensaje: ""
    });
  //  console.log(this.detalleId);

    this.item.foroId = this.detalleId;
    if(this.responder){
      this.item.EsRespuesta="SI";
      this.item.MensajeRespuesta=this.mensaje;
      this.item.NombreUsuarioRespuesta=this.nombre;
      this.slidingItem.closeOpened();
      this.responder=false;

    }
    this.contentArea.scrollToPoint(0,0,200);
  //  console.log("this.item");
  //  console.log( this.item);

  /*  const payload = new FormData();
    payload.append('ForoId', this.detalleId.toString());
    payload.append('Mensaje', this.item.Comentario);*/


    const tareaUpload = await this.apiForum.save(this.item).toPromise();

    /*let item2 = {
      id: 60,
      usuarioId: 1,
      foroId: 2,
      mensaje: 'refrescar',
      fecha: '2020-06-05T00:00:00',
      foro: null,
      hora: '16:58:57'
    };*/

    //this.LstForo.unshift(this.item);
    //this.applicationRef.tick();

   // this.submitAttempt = false;
  }

  private subscribeToEvents(): void {

    this.webSocket.commentReceived.subscribe((comment: any) => {
    //    comment.Hora.Minutes = comment.Hora.Minutes.length == 1 ? `0${comment.Hora.Minutes}` : comment.Hora.Minutes;
    //    comment.Hora.Seconds = comment.Hora.Seconds.length == 1 ? `0${comment.Hora.Seconds}` : comment.Hora.Seconds;
    //    comment.Hora = `${comment.Hora.Hours}:${comment.Hora.Minutes}:${comment.Hora.Seconds}`
        this.LstForo.unshift(comment);
        this.applicationRef.tick();
        console.log(comment);
    });
  }

  logDrag(event,item){
    console.log(event);
    let percent = event.detail.ratio;
    if (percent > 0) {
      // positive
      console.log('right side');
    } else {
      // negative
      console.log('left side');
    }
    if (Math.abs(percent) > 1) {
      console.log('overscroll');
    }
  }

  drag(event){

    //console.log(event.detail.ratio);
    let percent = event.detail.ratio;
    if (percent > 0) {
      // positive
      //console.log('right side');
    } else {
      // negative
     // console.log('left side');
    }
    if (Math.abs(percent) > 1) {
     // console.log('overscroll');
    }

  }
  test(){
   // console.log("test");
  }

  async presentActionSheet(item) {
    this.nombre= item.Usuario.Nombre + " " + item.Usuario.ApellidoPaterno + " " + item.Usuario.ApellidoMaterno;
    this.mensaje = item.Mensaje;
    this.responder=true;
    console.log(this.slidingItem);
    this.slidingItem.closeOpened();
    this.classresponder='display-contents';
    this.input.setFocus();
   
   // this.animacion(true);
   
  }
  closeRespuesta(){
    this.slidingItem.closeOpened();
    this.responder=false;
  }

  animacion(isOpen){
    let animation4: Animation;
    animation4 = this.animationCtrl.create('identifier4-a')
    .addElement(this.toolbar1.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
  }
  eliminarMensajeForo(item){
  




    
    this.apiForum.deleteComentario(item.Id).subscribe(data => {
      console.log(item.Id)
      this.LstForo = this.LstForo.filter(obj => obj !== item);
    });

    

  }

}
