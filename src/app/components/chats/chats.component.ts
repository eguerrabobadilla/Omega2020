import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetallesChatPage } from 'src/app/pages/detalles-chat/detalles-chat.page';
import { ChatService } from '../../api/chat.service';
import { DetalleChatGroupPage } from 'src/app/pages/detalle-chat-group/detalle-chat-group.page';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {

  public LstChat: any[] = [];
  public LstGrupos: any[] = [];
  cargandoGrupos:boolean = false;
  cargandoAlumnos:boolean = false;

  constructor( private modalCrl: ModalController,private apichat: ChatService) { 
    this.cargar();
  }

  public cargar() {

    /*this.apichat.getConversaciones().subscribe(data =>{
      this.LstChat = data;
    });

    this.apichat.getGruposMaestrosChat().subscribe(data => {
      this.LstGrupos= data;
    });*/

    this.refrescarAlumnos();
    this.refrescarGrupos();

  }


  async openDetail(event: Event, item) {

    /*this.apiForum.get(true,0).subscribe(data =>{
    });*/

    const modal = await this.modalCrl.create({
        component: DetallesChatPage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        showBackdrop: false,
        componentProps: {item}
      });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
     // this.LstForo = await this.apiForum.get(false, 0).toPromise();
    });
  }

  async openDetailGroups(event: Event, item){
     const modal =  await  this.modalCrl.create({
      component: DetalleChatGroupPage,
      cssClass: 'my-custom-modal-css',
      mode: 'ios',
      backdropDismiss: true,
      showBackdrop: false,
      componentProps: {
        item : item
      }
    });

    await modal.present();
  }

  refrescarGrupos() {
    this.cargandoGrupos=true;
    this.apichat.getGruposMaestrosChat().subscribe(data => {
      this.LstGrupos= data;
      this.cargandoGrupos=false;
    });
  }

  refrescarAlumnos() {
    this.cargandoAlumnos=true;
    this.apichat.getConversaciones().subscribe(data =>{
      this.LstChat = data;
      this.cargandoAlumnos=false;
    });
  }

  ngOnInit() {}

  public permisoEditar() {
    const jwt_temp = localStorage.getItem('USER_INFO_TEMP');
    if(jwt_temp != null)
    {
        return false;
    }
    
    if(this.getKeyToken('tipo')=='Profesor')
      return true;
    else
      return false;
  }
  
  getKeyToken(key: string): string {

    const jwt = localStorage.getItem('USER_INFO');

    const jwtData = jwt.split('.')[1];
    // let decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtJsonData = decodeURIComponent(escape(window.atob(jwtData)));
    const decodedJwtData = JSON.parse(decodedJwtJsonData);

    const value = decodedJwtData[key];

    return value;
  }

}
