import { Component, OnInit, ApplicationRef, NgZone, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../api/chat.service';
import { ModalController, IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-detalles-chat',
  templateUrl: './detalles-chat.page.html',
  styleUrls: ['./detalles-chat.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetallesChatPage implements OnInit {

  @Input() item;
  @Input() groups;
  itemApiChat: any;
  public FrmItem: FormGroup;
  @ViewChild('chatList', {read: ElementRef, static: true}) chatList: ElementRef;
  LstChats: any[] = [];
  private mutationObserver: MutationObserver;
  title: string = '';
  groupId: string;
  usuarioId: number;
  subscribeChat: Subscription;

  @ViewChild('Content', {static: true}) contentArea: IonContent;

  detalleId: number;

  constructor(private apichat: ChatService, private modalCtrl: ModalController, private  formBuilder : FormBuilder,
              private applicationRef: ApplicationRef, private webSocket: WebsocketService, private _ngZone: NgZone) {
      console.log("constructor");
      this.FrmItem = formBuilder.group({
        Mensaje: ['', Validators.compose([Validators.required])]
      });

      this.subscribeToEvents();
  }

  ngOnInit() {
    //Me uno al grupo
    // this.webSocket.AddToGroup(`foro-${this.detalleId}`);

    console.log(this.item);
    this.usuarioId = this.item.UsuarioId;

    this.title = `${this.item.UsuarioId2Navigation.Nombre} ${this.item.UsuarioId2Navigation.ApellidoPaterno}
                                                                    ${this.item.UsuarioId2Navigation.ApellidoMaterno} `;

    this.apichat.getChatByIdUsuario(this.item.UsuarioId2).subscribe(data => {
      this.LstChats = data;
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
  async ionViewDidEnter() {
      await this.apichat.updateAcceso(this.item.UsuarioId2).toPromise();
    //if(this.item.Tareasusuarios.length > 0)
      this.item.Visto='SI';
  }

  ionViewDidLoad() {
    
  }

  async crearMensaje() {
      this.itemApiChat = this.FrmItem.value;
      this.itemApiChat.UsuarioIdOrigen = this.item.UsuarioId;
      this.itemApiChat.UsuarioIdDestino = this.item.UsuarioId2;
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.itemApiChat.FechaMensaje= today;
      this.itemApiChat.HoraMensaje= time;

      const tareaUpload = await this.apichat.addMensajes(this.itemApiChat).toPromise();
      this.FrmItem.reset();
      //this.LstChats.unshift(this.itemApiChat);
      console.log(this.itemApiChat);
      this.LstChats.push(this.itemApiChat);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async ngOnDestroy() {
    console.log("page cerrado");
    await this.subscribeChat.unsubscribe();
  }

  private subscribeToEvents() : void{

     this.subscribeChat= this.webSocket.messageReceived.subscribe(async (message: any) => {
          message.HoraMensaje.Minutes = message.HoraMensaje.Minutes.length == 1 ? `0${message.HoraMensaje.Minutes}` : message.HoraMensaje.Minutes;
          message.HoraMensaje.Seconds = message.HoraMensaje.Seconds.length == 1 ? `0${message.HoraMensaje.Seconds}` : message.HoraMensaje.Seconds;
          message.HoraMensaje = `${message.HoraMensaje.Hours}:${message.HoraMensaje.Minutes}:${message.HoraMensaje.Seconds}`;

          //this.LstChats.unshift(message);
          this.LstChats.push(message);
          this.applicationRef.tick();

          await this.apichat.updateAcceso(this.item.UsuarioId2).toPromise();
          //if(this.item.Tareasusuarios.length > 0)
          this.item.Visto='SI';

          console.log("recibido");
          console.log(message);
      });
  }

}
