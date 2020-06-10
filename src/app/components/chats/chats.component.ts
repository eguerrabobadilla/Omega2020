import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetallesChatPage } from 'src/app/pages/detalles-chat/detalles-chat.page';
import { ChatService } from '../../api/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {

  public LstChat: any[] = [];

  constructor( private modalCrl: ModalController,private apichat: ChatService) { 
    this.cargar();
  }

  public cargar() {

    this.apichat.getConversaciones().subscribe(data =>{
      this.LstChat = data;
      console.log('this.LstForo NOW');
      console.log(this.LstChat);
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
        componentProps: {item}
      });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
     // this.LstForo = await this.apiForum.get(false, 0).toPromise();
    });
  }

  ngOnInit() {}

}
