import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationController, Animation, ModalController } from '@ionic/angular';
import { DetallesChatPage } from '../detalles-chat/detalles-chat.page';
import { ChatService } from '../../api/chat.service';
import { DetalleChatGroupPage } from '../detalle-chat-group/detalle-chat-group.page';

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
    });

    this.apiChat.getAlumnos().subscribe(data => {
      this.LstUsuarios = data;
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
    if (this.LstContactos.find(a => a.id === item.Id) === undefined) {
      this.LstContactos.push(item);
    } else {
      this.LstContactos.splice(this.LstContactos.findIndex(a => a.id === item.Id), 1);
    }

    this.enpezarChat();
  }

  addGroup(item) {
    if (this.LstGruposContactos.find(a => a.id === item.Id) === undefined) {
      this.LstGruposContactos.push(item);
    } else {
      this.LstGruposContactos.splice(this.LstGruposContactos.findIndex(a => a.id === item.Id), 1);
    }

    this.enpezarChat();
  }

  async enpezarChat() {
    let item: any;
    if (this.LstContactos.length === 0 && this.LstGruposContactos.length== 0) {
      return;
    }

    if(this.LstContactos.length > 0) {
      item = this.LstContactos[0];

      this.modalCtrl.dismiss();

      const modal =  await  this.modalCtrlChat.create({
          component: DetallesChatPage,
          cssClass: 'my-custom-modal-css',
          mode: 'ios',
          backdropDismiss: true,
          showBackdrop: false,
          componentProps: {
            item : item
          }
      });

      await modal.present();
    } else if(this.LstGruposContactos.length > 0) {

      item = this.LstGruposContactos[0];

      this.modalCtrl.dismiss();
      
      const modal =  await  this.modalCtrlChat.create({
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
