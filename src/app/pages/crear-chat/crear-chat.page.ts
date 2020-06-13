import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationController, Animation, ModalController } from '@ionic/angular';
import { DetallesChatPage } from '../detalles-chat/detalles-chat.page';
import { ChatService } from '../../api/chat.service';

@Component({
  selector: 'app-crear-chat',
  templateUrl: './crear-chat.page.html',
  styleUrls: ['./crear-chat.page.scss'],
})
export class CrearChatPage implements OnInit {
  LstContactos: any[] = [];
  LstGruposContactos: any[] = [];

  LstUsuarios: any[];
  LstGrupos: any[] = [];

  SearText: any = '';


  @ViewChild('search', {read: ElementRef, static: true}) search: ElementRef;


  constructor(private animationCtrl: AnimationController, private modalCtrl: ModalController,
              private modalCtrlChat: ModalController, private apiChat: ChatService) { }

  ngOnInit() {

    this.apiChat.getGruposMaestros().subscribe(data => {
      this.LstGrupos = data;
      console.log(this.LstGrupos);
    });

    this.apiChat.getAlumnos().subscribe(data => {
      this.LstUsuarios = data;
      console.log(this.LstUsuarios);
    });

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
    console.log(item);

    if (this.LstContactos.find(a => a.id === item.id) === undefined) {
      this.LstContactos.push(item);
    } else {
      this.LstContactos.splice(this.LstContactos.findIndex(a => a.id === item.id), 1);
    }
  }

  addGroup(item) {
    console.log(item);

    if (this.LstGruposContactos.find(a => a.id === item.id) === undefined) {
      this.LstGruposContactos.push(item);
    } else {
      this.LstGruposContactos.splice(this.LstGruposContactos.findIndex(a => a.id === item.id), 1);
    }
  }

  async enpezarChat(event: Event, item) {

    /*this.apiForum.get(true,0).subscribe(data =>{
    });*/

    /*if (this.LstContactos.length === 0) {
      return;
    }*/

    item = this.LstContactos[0];

    this.modalCtrl.dismiss();

    const modal =  await  this.modalCtrlChat.create({
        component: DetallesChatPage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        showBackdrop: false,
        componentProps: {
          item : item,
          groups : this.LstGruposContactos[0]
        }
    });

    // this.closeModal();
    await modal.present();


    /*modal.onDidDismiss().then( async (data) => {
     // this.LstForo = await this.apiForum.get(false, 0).toPromise();
    });*/
  }

  animacionSearchBar(esEntrada) {
    let animation2: Animation;

    if (esEntrada) {
      animation2 = this.animationCtrl.create('my-animation-identifier2')
      .addElement(this.search.nativeElement)
      .duration(300)
      .delay(150)
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
