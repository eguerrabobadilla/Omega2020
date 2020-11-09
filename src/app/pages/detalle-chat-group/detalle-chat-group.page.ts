import { Component, OnInit, Input, ViewChild, ElementRef, ApplicationRef } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/api/chat.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-detalle-chat-group',
  templateUrl: './detalle-chat-group.page.html',
  styleUrls: ['./detalle-chat-group.page.scss'],
})
export class DetalleChatGroupPage implements OnInit {
  itemApiChat: any;
  title: string = '';
  @Input() item;
  public FrmItem: FormGroup;
  private mutationObserver: MutationObserver;
  LstChats: any[] = [];
  usuarioId: number=0;
  mensajesGruposId: number=0;

  @ViewChild('chatList', {read: ElementRef, static: true}) chatList: ElementRef;
  @ViewChild('Content', {static: true}) contentArea: IonContent;

  constructor( private modalCtrl: ModalController, private  formBuilder : FormBuilder,private apichat: ChatService,
              private webSocket: WebsocketService,private applicationRef: ApplicationRef) { 
    this.FrmItem = formBuilder.group({
      Mensaje: ['', Validators.compose([Validators.required])]
    });

    this.usuarioId = Number(this.getKeyToken("id"));
    console.log(this.usuarioId);
    this.subscribeToEvents();
  }

  ngOnInit() {
    console.log(this.item);
    /*if (this.groups !== undefined) {
      this.groups.id = 0;
      this.title = `Grupo ${this.groups.grado}${this.groups.grupo}`;
      this.apichat.crearGrupo(this.groups).subscribe(data => {
        this.groups.id = data['grupoId'];
        this.groups.usuarioId = data['usuarioId'];
        this.usuarioId = data['usuarioId'];
        console.log(data);
      });*/
    const grupoIngles = this.item.GrupoIngles=='SI' ? 'Ingles' : '';
    this.title = `Grupo ${this.item.Grado}${this.item.Grupo} ${this.item.Escolaridad} ${grupoIngles}`;

    this.apichat.crearGrupo(this.item).subscribe(data => {
      /*this.groups.id = data['grupoId'];
      this.groups.usuarioId = data['usuarioId'];
      this.usuarioId = data['usuarioId'];*/
      this.mensajesGruposId = data['GrupoId']

      //Me uno a la sala del grupo
      this.webSocket.AddToGroup(`chatGrupo-${this.mensajesGruposId}`);

      this.apichat.getChatGrupo(data['GrupoId']).subscribe(dataChatGroup => {
          this.LstChats = dataChatGroup;
      });
    });

    this.mutationObserver = new MutationObserver((mutations) => {
        setTimeout(() => {
          this.contentArea.scrollToBottom(10);  
        }, 50);
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
        childList: true
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async crearMensaje() {
    const msg = {
      MensajesGruposId : this.mensajesGruposId,
      Mensaje : this.FrmItem.controls['Mensaje'].value
    };

    //this.item.usuarioId = 1;

    this.itemApiChat = this.FrmItem.value;
    this.itemApiChat.UsuarioId = this.usuarioId;
    this.itemApiChat.mensajesGruposId = this.mensajesGruposId;
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.itemApiChat.FechaMensaje= today;
    this.itemApiChat.HoraMensaje= time;

    const tareaUpload = await this.apichat.addMensajeGrupo(msg).toPromise();
    
    this.FrmItem.reset();
    console.log(this.itemApiChat);
    this.LstChats.push(this.itemApiChat);
  }

  private subscribeToEvents(): void {
      this.webSocket.messageGroupReceived.subscribe((comment: any) => {
        comment.HoraMensaje.Minutes = comment.HoraMensaje.Minutes.length == 1 ? `0${comment.HoraMensaje.Minutes}` : comment.HoraMensaje.Minutes;
        comment.HoraMensaje.Seconds = comment.HoraMensaje.Seconds.length == 1 ? `0${comment.HoraMensaje.Seconds}` : comment.HoraMensaje.Seconds;
        comment.HoraMensaje = `${comment.HoraMensaje.Hours}:${comment.HoraMensaje.Minutes}:${comment.HoraMensaje.Seconds}`
        //this.LstChats.unshift(comment);
        if(comment.UsuarioId != this.usuarioId) {
          this.LstChats.push(comment);
          this.applicationRef.tick();
          console.log(comment);
        }
    });
  }

  getKeyToken(key: string) : string {

    let jwt = localStorage.getItem("USER_INFO");

    let jwtData = jwt.split('.')[1];
    //let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtJsonData=decodeURIComponent(escape(window.atob(jwtData)));
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    let value = decodedJwtData[key];

    return value;
  }

}
