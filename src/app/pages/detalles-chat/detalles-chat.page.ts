import { Component, OnInit, ApplicationRef, NgZone, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../api/chat.service';
import { ModalController, IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { WebsocketService } from '../../services/websocket.service';

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

  @ViewChild('Content', {static: true}) contentArea: IonContent;

  detalleId: number;

  constructor(private apichat: ChatService, private modalCtrl: ModalController, private  formBuilder : FormBuilder,
              private applicationRef: ApplicationRef, private webSocket: WebsocketService, private _ngZone: NgZone) {

      this.FrmItem = formBuilder.group({
        mensaje: ['', Validators.compose([Validators.required])]
      });

      this.subscribeToEvents();
  }

  ngOnInit() {
    //Me uno al grupo
    // this.webSocket.AddToGroup(`foro-${this.detalleId}`);

    console.log(this.item);
    this.usuarioId = this.item.usuarioId;

    this.title = `${this.item.usuarioId2Navigation.nombre} ${this.item.usuarioId2Navigation.apellidoPaterno}
                                                                    ${this.item.usuarioId2Navigation.apellidoMaterno} `;

    this.apichat.getChatByIdUsuario(this.item.usuarioId2).subscribe(data => {
      this.LstChats = data;
    });

    this.mutationObserver = new MutationObserver((mutations) => {
        this.contentArea.scrollToBottom();
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
        childList: true
    });

  }

  ionViewDidLoad() {

  }

  async crearMensaje() {
      this.itemApiChat = this.FrmItem.value;
      this.itemApiChat.usuarioIdOrigen = this.item.usuarioId;
      this.itemApiChat.usuarioIdDestino = this.item.usuarioId2;

      const tareaUpload = await this.apichat.addMensajes(this.itemApiChat).toPromise();
      this.FrmItem.reset();
      //this.LstChats.unshift(this.itemApiChat);
      this.LstChats.push(this.itemApiChat);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  private subscribeToEvents(): void {

    this.webSocket.messageReceived.subscribe((message: any) => {
        //this.LstChats.unshift(message);
        this.LstChats.push(message);
        this.applicationRef.tick();
        console.log(message);
    });
  }

}
