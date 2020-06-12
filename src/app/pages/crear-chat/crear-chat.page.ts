import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationController, Animation, ModalController } from '@ionic/angular';
import { DetallesChatPage } from '../detalles-chat/detalles-chat.page';

@Component({
  selector: 'app-crear-chat',
  templateUrl: './crear-chat.page.html',
  styleUrls: ['./crear-chat.page.scss'],
})
export class CrearChatPage implements OnInit {
  LstContactos: any[] = [];

  @ViewChild('search', {read: ElementRef, static: true}) search: ElementRef;


  constructor(private animationCtrl: AnimationController, private modalCtrl: ModalController,
              private modalCtrlChat: ModalController) { }

  ngOnInit() {
  }

  focused() {
    this.animacionSearchBar(true);
  }

  blur() {
    this.animacionSearchBar(false);
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }

  addContact(item) {

    const itemChat = {
      usuarioId2 : item,
      usuarioId2Navigation : {
        apellidoMaterno: 'Bobadilla',
        apellidoPaterno: 'Guerra',
        nombre: 'Eduardo'
      }
    };

    this.LstContactos.push(itemChat);
  }

  async enpezarChat(event: Event, item) {

    /*this.apiForum.get(true,0).subscribe(data =>{
    });*/

    item = this.LstContactos[0];
  
    const modal =  await  this.modalCtrlChat.create({
        component: DetallesChatPage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        componentProps: { item }
      });
    this.closeModal();
    await modal.present();
   


    modal.onDidDismiss().then( async (data) => {
     // this.LstForo = await this.apiForum.get(false, 0).toPromise();
    });
  }

  animacionSearchBar(esEntrada) {
    let animation2: Animation;

    if (esEntrada) {
      animation2 = this.animationCtrl.create('my-animation-identifier2')
      .addElement(this.search.nativeElement)
      .duration(300)
      .delay(50)
      .easing('cubic-bezier(0,.70,.45,1)')
      .beforeAddClass('backgroundcolor')
      .fromTo('transform', 'translateX(84%)', 'translateX(0%)');
  } else {
      animation2 = this.animationCtrl.create('my-animation-identifier2')
      .addElement(this.search.nativeElement)
      .duration(300)
      .delay(50)
      .easing('cubic-bezier(0,.70,.45,1)')
      .beforeRemoveClass('backgroundcolor')
      .fromTo('transform', 'translateX(0%)', 'translateX(84%)');
  }

    animation2.play();
  }

}
