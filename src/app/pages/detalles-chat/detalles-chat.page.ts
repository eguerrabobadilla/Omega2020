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

  closeModal(){
    this.modalCtrl.dismiss();
  }

}
