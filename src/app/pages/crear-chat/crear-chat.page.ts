import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AnimationController, Animation, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { DetallesChatPage } from '../detalles-chat/detalles-chat.page';
import { ChatService } from '../../api/chat.service';
import { DetalleChatGroupPage } from '../detalle-chat-group/detalle-chat-group.page';
import { GlobalService } from 'src/app/services/global.service';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { INFERRED_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-crear-chat',
  templateUrl: './crear-chat.page.html',
  styleUrls: ['./crear-chat.page.scss'],
})
export class CrearChatPage implements OnInit {
  @ViewChild('panelGrupos', {read: ElementRef, static: false}) panelGrupos: ElementRef;
  @ViewChild('botonGrupos', {read: ElementRef, static: false}) botonGrupos: ElementRef;
  @ViewChild('spinnerGrupos', {read: ElementRef, static: false})  spinnerGrupos: ElementRef;

  @ViewChild('panelProfesores', {read: ElementRef, static: false}) panelProfesores: ElementRef;
  @ViewChild('botonProfesores', {read: ElementRef, static: false}) botonProfesores: ElementRef;
  @ViewChild('spinnerProfesores', {read: ElementRef, static: false})  spinnerProfesores: ElementRef;

  @ViewChild('panelAlumnos', {read: ElementRef, static: false}) panelAlumnos: ElementRef;
  @ViewChild('botonAlumnos', {read: ElementRef, static: false}) botonAlumnos: ElementRef;
  @ViewChild('spinnerAlumnos', {read: ElementRef, static: false}) spinnerAlumnos: ElementRef;

  @ViewChild(IonInfiniteScroll,{static: false}) infiniteScroll: IonInfiniteScroll;

  LstContactos: any[] = [];
  LstGruposContactos: any[] = [];

  LstUsuarios: any[];
  LstGrupos: any[] = [];
  LstDocentesDirector: any[] = [];
  LstDocentesAlumnos: any[] = [];

  SearText: any = '';
  showGroups: boolean = false;
  showTeachers: boolean = false;
  showStudents: boolean = false;
  Busqueda: any = 'Seleccione';
  textoBuscar: any = '';

  contadorInfinieScroll: number = 0;


  @ViewChild('search', {read: ElementRef, static: true}) search: ElementRef;


  constructor(private animationCtrl: AnimationController, private modalCtrl: ModalController,
              private modalCtrlChat: ModalController, private apiChat: ChatService,private globalServicies: GlobalService,
              private renderer: Renderer2) { }

  ngOnInit() {

    if(this.getTipoUsuario()=='Alumno' || this.getTipoUsuario()=='Profesor')
    {
      this.apiChat.getGruposMaestros().subscribe(data => {
        this.LstGrupos = data;
      });

      this.apiChat.getAlumnos().subscribe(data => {
        this.LstUsuarios = data;
      });
    }
  }

  focused() {
    console.log("focusend");
    this.textoBuscar='';
    this.animacionSearchBar(true);
  }

  blur(){
    this.animacionSearchBar(false);
  }

  async ionClear() {
    this.contadorInfinieScroll = 0;
    this.infiniteScroll.disabled =false;
    this.textoBuscar="";

    if(this.showTeachers==true) {
      this.LstDocentesDirector= [];

      this.renderer.setStyle(this.spinnerProfesores.nativeElement, 'display','block');
      this.LstDocentesDirector = await this.apiChat.getMaestrosDirector('',this.contadorInfinieScroll,30).toPromise();
      this.contadorInfinieScroll += 30;

      this.renderer.setStyle(this.spinnerProfesores.nativeElement, 'display','none');
    } 
    else if(this.showStudents==true) {
      this.LstDocentesAlumnos= [];

      this.renderer.setStyle(this.spinnerAlumnos.nativeElement, 'display','block');
      this.LstDocentesAlumnos = await this.apiChat.getAlumnosDirector('',this.contadorInfinieScroll,30).toPromise();
      this.contadorInfinieScroll += 30;


      this.renderer.setStyle(this.spinnerAlumnos.nativeElement, 'display','none');
    }
  }

  ionChange(event) {
    if(this.getTipoUsuario()!='Director') return;

      if(event.detail.value.length < 4) return;

      if(this.showTeachers==true) {
        this.LstDocentesDirector = [];

        this.textoBuscar = event.detail.value;
        this.contadorInfinieScroll=0;
        this.renderer.setStyle(this.spinnerProfesores.nativeElement, 'display','block');
        this.infiniteScroll.disabled=false;
        
        this.apiChat.getMaestrosDirector(this.textoBuscar,this.contadorInfinieScroll,30).subscribe(data => {
          if(data.length!=0) {
            this.LstDocentesDirector = data;
            this.contadorInfinieScroll += 30;
          }
          
          this.renderer.setStyle(this.spinnerProfesores.nativeElement, 'display','none');
        });
      } else {
        this.LstDocentesAlumnos = [];

        this.textoBuscar = event.detail.value;
        this.contadorInfinieScroll=0;
        this.renderer.setStyle(this.spinnerAlumnos.nativeElement, 'display','block');
        this.infiniteScroll.disabled=false;
        
        this.apiChat.getAlumnosDirector(this.textoBuscar,this.contadorInfinieScroll,30).subscribe(data => {
          if(data.length!=0) {
            this.LstDocentesAlumnos = data;
            this.contadorInfinieScroll += 30;
          }
          
          this.renderer.setStyle(this.spinnerAlumnos.nativeElement, 'display','none');
        });
      }
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

  getTipoUsuario() {
    const tipo=this.globalServicies.getKeyToken("tipo");
    
    return tipo;
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

  async abrirGrupos() {
    console.log("abrirGrupos");
    this.showGroups = true;

    if(this.LstGrupos.length == 0)
    {
      this.renderer.setStyle(this.spinnerGrupos.nativeElement, 'display','block');
      this.LstGrupos = await this.apiChat.getGruposMaestros().toPromise();
      this.renderer.setStyle(this.spinnerGrupos.nativeElement, 'display','none');
    }

    setTimeout(() => {
      const statusPanel = this.panelGrupos.nativeElement.getAttribute("status");

      if(statusPanel=="close") {
        this.renderer.removeStyle(this.panelGrupos.nativeElement, 'max-height');
        this.renderer.addClass(this.botonGrupos.nativeElement, 'active');
        this.panelGrupos.nativeElement.setAttribute('status','open');
        this.renderer.removeStyle(this.panelGrupos.nativeElement, 'display');

        this.renderer.setStyle(this.search.nativeElement, 'display','block');

        this.Busqueda="Buscar Grupo";

        //Cierra los otros paneles
        if(this.showTeachers==true)
          this.abrirProfesores();

        if(this.showStudents==true)
          this.abrirAlumnos();
      }
      else {
        this.renderer.setStyle(this.panelGrupos.nativeElement, 'max-height','0');
        this.renderer.removeClass(this.botonGrupos.nativeElement, 'active');
        this.panelGrupos.nativeElement.setAttribute('status','close');
        this.renderer.setStyle(this.panelGrupos.nativeElement, 'display','none');
        this.renderer.setStyle(this.search.nativeElement, 'display','none');
        this.showGroups = false;
        this.Busqueda="Seleccione";
      }
    }, 100);
  }

  async abrirProfesores() {
    console.log("abrirProfesores");
    this.showTeachers = true;

    if(this.LstDocentesDirector.length == 0)
    {
      
      this.contadorInfinieScroll = 0;
      this.LstDocentesDirector= [];
      this.infiniteScroll.disabled =false;
      this.textoBuscar="";

      this.renderer.setStyle(this.spinnerProfesores.nativeElement, 'display','block');
      this.LstDocentesDirector = await this.apiChat.getMaestrosDirector('',this.contadorInfinieScroll,30).toPromise();
      this.contadorInfinieScroll += 30;


      this.renderer.setStyle(this.spinnerProfesores.nativeElement, 'display','none');
    }

    setTimeout(() => {
      const statusPanel = this.panelProfesores.nativeElement.getAttribute("status");

      if(statusPanel=="close") {
        this.renderer.removeStyle(this.panelProfesores.nativeElement, 'max-height');
        this.renderer.addClass(this.botonProfesores.nativeElement, 'active');
        this.panelProfesores.nativeElement.setAttribute('status','open');
        this.renderer.removeStyle(this.panelProfesores.nativeElement, 'display');

        this.renderer.setStyle(this.search.nativeElement, 'display','block');

        this.Busqueda="Buscar Docente";

        //Cierra los otros paneles
        if(this.showGroups==true)
            this.abrirGrupos();
        
        if(this.showStudents==true)
          this.abrirAlumnos();
      }
      else {
        this.renderer.setStyle(this.panelProfesores.nativeElement, 'max-height','0');
        this.renderer.removeClass(this.botonProfesores.nativeElement, 'active');
        this.panelProfesores.nativeElement.setAttribute('status','close');
        this.renderer.setStyle(this.panelProfesores.nativeElement, 'display','none');
        this.renderer.setStyle(this.search.nativeElement, 'display','none');
        this.showTeachers = false;
        this.Busqueda="Seleccione";

        this.contadorInfinieScroll = 0;
        this.LstDocentesDirector= [];
      }
    }, 100);
  }

  async abrirAlumnos() {
    console.log("abrirAlumnos");
    this.showStudents = true;

    if(this.LstDocentesAlumnos.length == 0)
    {
      this.contadorInfinieScroll = 0;
      this.LstDocentesAlumnos= [];
      this.infiniteScroll.disabled =false;
      this.textoBuscar="";

      this.renderer.setStyle(this.spinnerAlumnos.nativeElement, 'display','block');
      this.LstDocentesAlumnos = await this.apiChat.getAlumnosDirector('',this.contadorInfinieScroll,30).toPromise();
      this.contadorInfinieScroll += 30;


      this.renderer.setStyle(this.spinnerAlumnos.nativeElement, 'display','none');
    }

    setTimeout(() => {
      const statusPanel = this.panelAlumnos.nativeElement.getAttribute("status");

      if(statusPanel=="close") {

        this.renderer.removeStyle(this.panelAlumnos.nativeElement, 'max-height');
        this.renderer.addClass(this.botonAlumnos.nativeElement, 'active');
        this.panelAlumnos.nativeElement.setAttribute('status','open');
        this.renderer.removeStyle(this.panelAlumnos.nativeElement, 'display');

        this.renderer.setStyle(this.search.nativeElement, 'display','block');

        this.Busqueda="Buscar Alumno";

        //Cierra los otros paneles
        if(this.showGroups==true)
            this.abrirGrupos();
          
        if(this.showTeachers==true)
            this.abrirProfesores();

      }
      else {

        this.renderer.setStyle(this.panelAlumnos.nativeElement, 'max-height','0');
        this.renderer.removeClass(this.botonAlumnos.nativeElement, 'active');
        this.panelAlumnos.nativeElement.setAttribute('status','close');
        this.renderer.setStyle(this.panelAlumnos.nativeElement, 'display','none');
        this.renderer.setStyle(this.search.nativeElement, 'display','none');
        this.showStudents = false;
        this.Busqueda="Seleccione";

        this.contadorInfinieScroll = 0;
        this.LstDocentesAlumnos= [];

      }
    }, 100);
  }

  loadData(event) {
    if(this.showTeachers==true)
      this.loadDataDocentes(event);
    else if(this.showStudents==true)
      this.loadDataAlumnos(event);
  }

  loadDataAlumnos(event){
    this.apiChat.getAlumnosDirector(this.textoBuscar,this.contadorInfinieScroll,30).subscribe(data => {
 
      if(data.length!=0) {
        for (let i = 0; i < data.length; i++) {
          this.LstDocentesAlumnos.push(data[i]);
        }

        event.target.complete();
        this.contadorInfinieScroll += 30;
      }
      else {
        console.log("fin scroll");
        event.target.disabled = true;
      }
    });
  }

  loadDataDocentes(event){
    this.apiChat.getMaestrosDirector(this.textoBuscar,this.contadorInfinieScroll,30).subscribe(data => {
 
      if(data.length!=0) {
        for (let i = 0; i < data.length; i++) {
          this.LstDocentesDirector.push(data[i]);
        }

        event.target.complete();
        this.contadorInfinieScroll += 30;
      }
      else {
        console.log("fin scroll");
        event.target.disabled = true;
      }
    });
  }

}
