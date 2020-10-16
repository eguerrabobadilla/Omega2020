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

  constructor( private modalCrl: ModalController,private apichat: ChatService) { 
    this.cargar();
  }

  public cargar() {

    this.apichat.getConversaciones().subscribe(data =>{
      this.LstChat = data;
    });

    this.apichat.getGruposMaestrosChat().subscribe(data => {
      this.LstGrupos= data;
    });

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

  ngOnInit() {}

}
