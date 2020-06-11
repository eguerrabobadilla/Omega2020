import { Component, OnInit, ApplicationRef, NgZone, Input } from '@angular/core';
import { ChatService } from '../../api/chat.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-detalles-chat',
  templateUrl: './detalles-chat.page.html',
  styleUrls: ['./detalles-chat.page.scss'],
})
export class DetallesChatPage implements OnInit {

  @Input() item;
  itemApiChat: any;
  public FrmItem: FormGroup;
  LstChats: any[];
  detalleId: number;

  constructor(private apichat: ChatService, private modalCtrl: ModalController, private  formBuilder : FormBuilder,
              private applicationRef: ApplicationRef, private webSocket: WebsocketService, private _ngZone: NgZone) {

      this.FrmItem = formBuilder.group({
        mensaje: ['', Validators.compose([Validators.required])]
      });
  }

  ngOnInit() {


    //Me uno al grupo
  //  this.webSocket.AddToGroup(`foro-${this.detalleId}`);

    this.apichat.getChatByIdUsuario(this.item.usuarioId2).subscribe(data => {
      this.LstChats = data;
    });

  }

  async crearMensaje() {
     console.log("crear noticia")

      this.itemApiChat = this.FrmItem.value;
      this.itemApiChat.usuarioIdOrigen = this.item.usuarioId;
      this.itemApiChat.usuarioIdDestino = this.item.usuarioId2;

      console.log(this.itemApiChat);
   //   this.itemApiChat.usuarioIdOrigen = item. 
  /*    {
      usarioId  "usuarioIdOrigen": 2,
      usarioId2   "usuarioIdDestino": 1,
        "mensaje": "Otro mensaje de postman de eduardo"
      }*/
      const tareaUpload = await this.apichat.addMensajes(this.itemApiChat).toPromise();

    }

  closeModal(){
    this.modalCtrl.dismiss();
  }

}
