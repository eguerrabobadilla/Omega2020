import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/api/chat.service';

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

  constructor( private modalCtrl: ModalController, private  formBuilder : FormBuilder,private apichat: ChatService) { 
    this.FrmItem = formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required])]
    });

    this.usuarioId = Number(this.getKeyToken("id"));
  }

  ngOnInit() {
    
    /*if (this.groups !== undefined) {
      this.groups.id = 0;
      this.title = `Grupo ${this.groups.grado}${this.groups.grupo}`;
      this.apichat.crearGrupo(this.groups).subscribe(data => {
        this.groups.id = data['grupoId'];
        this.groups.usuarioId = data['usuarioId'];
        this.usuarioId = data['usuarioId'];
        console.log(data);
      });*/
    this.title = `Grupo ${this.item.grado}${this.item.grupo}`;

    this.apichat.crearGrupo(this.item).subscribe(data => {
      /*this.groups.id = data['grupoId'];
      this.groups.usuarioId = data['usuarioId'];
      this.usuarioId = data['usuarioId'];*/
      this.mensajesGruposId = data['grupoId']
      this.apichat.getChatGrupo(data['grupoId']).subscribe(dataChatGroup => {
          this.LstChats = dataChatGroup;
      });
    });

    this.mutationObserver = new MutationObserver((mutations) => {
      this.contentArea.scrollToBottom();
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
      Mensaje : this.FrmItem.controls['mensaje'].value
    };

    //this.item.usuarioId = 1;

    this.itemApiChat = this.FrmItem.value;
    this.itemApiChat.usuarioId = this.usuarioId;
    this.itemApiChat.mensajesGruposId = this.mensajesGruposId;

    const tareaUpload = await this.apichat.addMensajeGrupo(msg).toPromise();
    
    this.FrmItem.reset();
    this.LstChats.push(this.itemApiChat);
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
