import { Component, ElementRef, ViewChild, Renderer2, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { AnimationController, Animation, IonContent, Platform, IonSlides, ModalController, LoadingController, AlertController, PickerController, IonSelect } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Gesture, GestureController } from '@ionic/angular';
import { PillMenuComponent } from '../components/pill-menu/pill-menu.component';
import { DetallePage } from '../detalle/detalle.page';
import { NuevoRecursoPage } from '../nuevo-recurso/nuevo-recurso.page';
import { BooksComponent } from '../components/books/books.component';
import { BooksService } from '../services/books.service';
import { AuthenticationService } from '../services/authentication.service';
import { TareasService } from '../api/tareas.service';
import { CodesComponent } from '../components/codes/codes.component';
import { Libros } from '../models/Libros';
import { CrearForumPage } from '../pages/crear-forum/crear-forum.page';
import { ForumComponent } from '../components/forum/forum.component';
import { CrearChatPage } from '../pages/crear-chat/crear-chat.page';
import { NewResourcePage } from '../new-resource/new-resource.page';
import { CrearNewsPage } from '../pages/crear-news/crear-news.page';
import { NewsComponent } from '../components/news/news.component';
import { mobiscroll, MbscCalendarOptions, MbscCalendar, MbscCalendarComponent } from '@mobiscroll/angular';
import { WebsocketService } from '../services/websocket.service';
import { ThrowStmt } from '@angular/compiler';
import { CalendarEventsPage } from '../pages/calendar-events/calendar-events.page';
import { CalendarioService } from '../api/calendario.service';
import { MateriasService } from '../api/materias.service';
import { CrearEvidencePage } from '../pages/crear-evidence/crear-evidence.page';
import { EvidencesComponent } from '../components/evidences/evidences.component';
import { CrearTopicPage } from '../pages/crear-topic/crear-topic.page';
import { ListResourceComponent } from '../components/list-resource/list-resource.component';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { async } from '@angular/core/testing';
import { ListTareasComponent } from '../components/list-tareas/list-tareas.component';
import { ReportComponent } from '../components/report/report.component';
import { GraphicsComponent } from '../components/graphics/graphics.component';
import { PushService } from '../services/push.service';
import { DevicesService } from '../api/devices.service';
import { CrearExamenPage } from '../pages/crear-examen/crear-examen.page';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ListExamenesComponent } from '../components/list-examenes/list-examenes.component';
import { PortadasService } from '../api/portadas.service';
import { Zip } from '@ionic-native/zip/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ThemeSwitcherService } from '../services/theme-switcher.service';
import { runInThisContext } from 'vm';

mobiscroll.settings = {
  theme: 'mobiscroll',
  themeVariant: 'light',
  layout: 'liquid'
};


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private observer: IntersectionObserver;
  scrollenable = false;
  pocisionInicial = true;
  tabs: any = [];
  now: number = Date.now();
  selectOption = '0';
  selectSeccion = 1;
  pildora = 'Tareas';
  pildoraExamenes = 'Examenes';
  index = 1 ;
  libros: any[] = [];
  materias: any[] = [];
  librosES: any[] = [];
  librosIN: any[] = []; 
  codigoVisible = true;
  hayConexion= true;
  numeroclicks=0;
  loading: any;
  /****Tipo seleccionado Rercuso****/
  TipoSeleccionado: any = 'Archivos';
  public Editor = ClassicEditor;
  lstthemeswitcher: any[] = [];//EDUARDO ENTREGA 03072021


  settings: MbscCalendarOptions = {
    theme: 'mobiscroll',
    display: 'inline',
    themeVariant: 'light',
    calendarScroll: 'vertical',
    //controls: ['calendar','time'],
    months: 1,
  onShow: (event, inst) => {
    setTimeout(() => { //temporal
      this.activarEventoTouch();
      this.apiCalendario.getCalendario().subscribe(data => {
        console.log("getCalendario");
        this.events = data;
      });
    }, 100);


  },
  onDayChange : (event, inst) => {
   this.abrirCalendarioSemana(event);
  }
  
};

  @ViewChild('slideDown', {static: false}) slideDown: IonSlides;
  @ViewChild('slideUp', {static: false}) slideUp: IonSlides;
  @ViewChild('slideVertical', {static: true}) slideVertical: IonSlides;
  @ViewChild('toolbar', {read: ElementRef, static: true}) toolbar: ElementRef;
  @ViewChild('toolbar1', {read: ElementRef, static: true}) toolbar1: ElementRef;
  @ViewChild('text', {read: ElementRef, static: true}) text: ElementRef;
  @ViewChild('elementsToProcess', {read: ElementRef, static: true}) elementsToProcess: ElementRef;
  @ViewChild('toolbar2', {read: ElementRef, static: true}) toolbar2: ElementRef;
  @ViewChild('IonContentScroll', {static: true}) IonContentScroll: IonContent;
  @ViewChild('content', {read: ElementRef, static: true}) contentref: ElementRef;
  @ViewChild('calendar', {static: false}) calendar: ElementRef;

  @ViewChild('pillMenu', {static: false}) pillMenu: PillMenuComponent;
  @ViewChild('appReport', {static: false}) appReport: ReportComponent;
  @ViewChild('appGraphics', {static: false}) appGraphics: GraphicsComponent;

  @ViewChild('content2', {read: ElementRef, static: true}) contentref2: ElementRef;
  @ViewChild('div2', {read: ElementRef, static: true}) div2: ElementRef;
  @ViewChild('footer', {read: ElementRef, static: true}) footer: ElementRef;
  @ViewChild('fab', {read: ElementRef, static: true}) fab: ElementRef;
  @ViewChild('fabstart', {read: ElementRef, static: true}) fabstart: ElementRef;
  @ViewChild('fabend', {read: ElementRef, static: true}) fabend: ElementRef;
  @ViewChild('fabNext', {read: ElementRef, static: true}) fabNext: ElementRef;
  @ViewChild('fabPrev', {read: ElementRef, static: true}) fabPrev: ElementRef;
  @ViewChild('fabflechaarriba', {read: ElementRef, static: true}) fabflechaarriba: ElementRef;
  @ViewChild('foot', {read: ElementRef, static: true}) foot: ElementRef;
  @ViewChild('animation7', {read: ElementRef, static: true}) animation7: ElementRef;
  @ViewChild('animation8', {read: ElementRef, static: true}) animation8: ElementRef;
  @ViewChild('pillMenu', {read: ElementRef, static: false}) pillMenuRef: ElementRef;
  @ViewChild('forumComponent', {static: false}) forumComponent: ForumComponent;
  @ViewChild('resourceComponent', {static: false}) resourceComponent: ListResourceComponent;
  @ViewChild('tareasComponent', {static: false}) tareasComponent: ListTareasComponent;
  @ViewChild('evidenceComponent', {static: false}) evidenceComponent: EvidencesComponent;
  @ViewChild('newsComponent', {static: false}) newsComponent: NewsComponent;
  @ViewChild('examenesComponent', {static: false}) examenesComponent: ListExamenesComponent;
  @ViewChild('booksComponent', {static: false}) booksComponent: BooksComponent;
  @ViewChild('booksComponentIngles', {static: false}) booksComponentIngles: BooksComponent;
  @ViewChild('booksComponentEspanol', {static: false}) booksComponentEspanol: BooksComponent;
  @ViewChild('avatarUser', {read: ElementRef, static: false}) avatarUser: ElementRef;
  @ViewChild('mobi', {static: false}) mobi: MbscCalendar; 
  @ViewChild('filtrosControl', {static: false}) filtrosControl: IonSelect;

  public fabVisible: boolean = true;
  public fabVisibleFilters: boolean = false;
  items: any[] = [];
  estadoArriba  = false;
  primeraVez = true;
  headersText: any = [];
  header = 'Books';
  nombreIcono = 'assets/img/books_icono.svg';
  iconos: any[];
  public swipeUp = false;
  public swipeUp2 = false;
  public swipeDown = false;
  public swipeDown2 = false;
  public gesture;
  public gesture2;
  public gesture3;
  public user = {
    nombre : '',
    grado  : ''
  };
  slideOpts = {
    loop: true
  };
  slideOptsdos = {
    autoHeight: true
  };
  events: any;
  isMobile: boolean=true;


  // tslint:disable-next-line: max-line-length
  constructor(private statusBar: StatusBar, public platform: Platform, private animationCtrl: AnimationController,
              // tslint:disable-next-line: max-line-length
              private renderer: Renderer2, private gestureCtrl2: GestureController, private gestureCtrl: GestureController, private modalCrl: ModalController, private booksService: BooksService,
              private loadingController: LoadingController, private alertController: AlertController,
              public authenticationService: AuthenticationService ,
              private apiTareas: TareasService, public  webSocket: WebsocketService, private apiCalendario: CalendarioService,
              private pickerController: PickerController, private apiMaterias: MateriasService,
              private storage: Storage,private router: Router,private globalServicies: GlobalService,
              private pushService: PushService,private apiDevice: DevicesService,private apiPortadas: PortadasService,
              private transfer: FileTransfer,private file: File,private zip: Zip,public themeSwitcher: ThemeSwitcherService) {
    //  this.scrollenable = true;


  }

  async animacion(isRegreso: boolean, click: boolean) {

   // if (this.primeraVez) {this.primeraVez = false; return; }
   

    let animation2: Animation;
    let animation4: Animation;
    let animation3: Animation;
    let animation5: Animation;
    let animation6: Animation;
    let animation7: Animation;
    let animation8: Animation;
    let animation9: Animation;
    let animation10: Animation;
    

    if (!isRegreso) {
   //   this.gesture.enable(false);
    //  this.gesture2.enable(false);
    //  this.renderer.setStyle(this.contentref2.nativeElement, 'z-index', `-1`);

      setTimeout(() => {
       // this.renderer.addClass(this.toolbar2.nativeElement, 'inverted-border-radius');
        this.pillMenu.aplicarSombra();
      }, 70);
   //   this.renderer.addClass(this.foot.nativeElement, 'sombraFooter');
      if (this.estadoArriba) { return; }

    // el ion tool bar le vamos hacer un trnasfor en el eje de la Y  hasta transform: translateY(-5vh);
      animation2 = this.animationCtrl.create('identifier2-a')
    .addElement(this.toolbar.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(0)', 'translateY(-3vh)');

      animation4 = this.animationCtrl.create('identifier4-a')
    .addElement(this.toolbar1.nativeElement)
    .beforeAddClass('colortoolbarUP')
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(0)', 'translateY(-9vh)');

      animation3 = this.animationCtrl.create('identifier3-a')
    .addElement(this.text.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    // tslint:disable-next-line: max-line-length
    .fromTo('transform', ' perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)', 'perspective(1px) translateY(2.01vh) translateZ(0) translateX(-8.01vw) scale(0.8)');

  /*    animation5 = this.animationCtrl.create('my-animation-identifier3')
    .addElement(this.footer.nativeElement)
    .afterAddClass('zindexFooterin')
    .duration(240)
    .delay(0)
    .fromTo('opacity', ' 1', '0');*/




      animation6 = this.animationCtrl.create('identifier6-a')
    .addElement(this.fab.nativeElement)
    .afterAddClass('zindexFooter')
    .duration(700)
    .delay(20)
    .easing('cubic-bezier(.61,1,.88,1)')
   .keyframes([{ offset: 0, transform: 'scale(0)' },
   { offset: 0.2, transform: 'scale(1)' },
   { offset: 0.5, transform: 'scale(1.3)' },
   { offset: 1, transform: 'scale(1)' }, ]);

      animation7 = this.animationCtrl.create('identifier7-a')
   .addElement(this.animation7.nativeElement)
   .duration(300)
   .delay(50)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', 'perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)', 'perspective(1px) translateY(-20vh) translateZ(0) translateX(-'+ this.tamañoMover() + 'vh) scale(calc(1/2))');

      animation8 = this.animationCtrl.create('identifier8-a')
   .addElement(this.animation8.nativeElement)
   .duration(300)
   .delay(40)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', ' translate(0, 0)', 'translate(-2vw, -15.5vh)');

      animation9 = this.animationCtrl.create('identifier9-a')
       .addElement(this.fabstart.nativeElement)
       .afterAddClass('zindexFooter')
       .duration(700)
       .delay(20)
       .easing('cubic-bezier(.61,1,.88,1)')
      .keyframes([{ offset: 0, transform: 'scale(0)' },
      { offset: 0.2, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(1.3)' },
      { offset: 1, transform: 'scale(1)' }, ]);

      animation10 = this.animationCtrl.create('identifier10-a')
        .addElement(this.fabend.nativeElement)
        .afterAddClass('zindexFooter')
        .duration(700)
        .delay(20)
        .easing('cubic-bezier(.61,1,.88,1)')
       .keyframes([{ offset: 0, transform: 'scale(0)' },
       { offset: 0.2, transform: 'scale(1)' },
       { offset: 0.5, transform: 'scale(1.3)' },
       { offset: 1, transform: 'scale(1)' }, ]);


      animation2.play();
      animation3.play();
    //  animation4.play();
    //  animation5.play();
      animation6.play();
      animation7.play();
      animation8.play();
      animation9.play();
      animation10.play();
      

     // if (click) {
      this.moveScroll(true);
    //  this.scrollenable = true;
      this.animacionBounce(true);

      // }
      this.estadoArriba = true;
  } else {


    this.moveScroll(false);
    if (this.estadoArriba === false ) { return; }
  //  this.renderer.removeClass(this.toolbar2.nativeElement, 'inverted-border-radius');
  //  this.renderer.removeClass(this.foot.nativeElement, 'sombraFooter');
    
    this.pillMenu.quitarSombra();
    animation2 = this.animationCtrl.create('identifier2-b')
    .addElement(this.toolbar.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(-3vh)', 'translateY(0)');

    animation4 = this.animationCtrl.create('identifier4-b')
    .addElement(this.toolbar1.nativeElement)
    .beforeAddClass('colortoolbarDOWN')
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(-7vh)', 'translateY(0)');


    animation3 = this.animationCtrl.create('identifier3-b')
    .addElement(this.text.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    // tslint:disable-next-line: max-line-length
    .fromTo('transform', ' perspective(1px) translateY(2.01vh) translateZ(0) translateX(-8.01vw) scale(0.8)', 'perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)');


  /*  animation5 = this.animationCtrl.create('my-animation-identifier3')
    .addElement(this.footer.nativeElement)
    .afterAddClass('zindexFooterout')
    .duration(100)
    .delay(10)
    .fromTo('opacity', '0', '1');*/




    animation6 = this.animationCtrl.create('identifier6-b')
    .addElement(this.fab.nativeElement)
    .afterAddClass('zindexFooter')
    .duration(200)
    .delay(0)
    .easing('cubic-bezier(.12,0,.39,0)')
   .keyframes([{ offset: 0, transform: 'scale(1)' },

   { offset: 1, transform: 'scale(0)' }, ]);

    animation7 = this.animationCtrl.create('identifier7-b')
   .addElement(this.animation7.nativeElement)
   .duration(300)
   .delay(50)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', 'perspective(1px) translateY(-20vh) translateZ(0) translateX(-'+ this.tamañoMover() + 'vh) scale(calc(1/2))', ' perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)');

    animation8 = this.animationCtrl.create('identifier8-b')
   .addElement(this.animation8.nativeElement)
   .duration(280)
   .delay(0)
   .fromTo('transform' , 'translate(-2vw, -15.5vh)', 'translate(0, 0)');
    

      animation9 = this.animationCtrl.create('identifier9-b')
     .addElement(this.fabstart.nativeElement)
     .afterAddClass('zindexFooter')
     .duration(200)
     .delay(0)
     .easing('cubic-bezier(.12,0,.39,0)')
    .keyframes([{ offset: 0, transform: 'scale(1)' },
  
    { offset: 1, transform: 'scale(0)' }, ]);
   

   
       animation10 = this.animationCtrl.create('identifier10-b')
      .addElement(this.fabend.nativeElement)
      .afterAddClass('zindexFooter')
      .duration(200)
      .delay(0)
      .easing('cubic-bezier(.12,0,.39,0)')
     .keyframes([{ offset: 0, transform: 'scale(1)' },
     { offset: 1, transform: 'scale(0)' }, ]);
    



      animation2.play();
      animation3.play();
  //    animation4.play();
   //   animation5.play();
      animation6.play();
      animation7.play();
      animation8.play();
     animation9.play();
     animation10.play();
  
      this.animacionBounce(false);
   

    this.estadoArriba = false;
    this.slideUp.lockSwipes(false);



  }


  }


  async moveScroll(directionUp: boolean) {
    /*
    if (directionUp) {
      console.log("move scroll arriba")
    const scrollto: number = (this.platform.height() ) -280;

    this.content.scrollToPoint(0, scrollto, 370);
  } else {
    //   this.scrollenable = false;
      await this.content.scrollToPoint(0, 0, 370);

     this.gesture.enable();
   //  this.gesture2.enable();
    // this.renderer.setStyle(this.contentref2.nativeElement, 'z-index', `4`);
  }
*/
  }

  mover() {
    
    if (this.pocisionInicial) {
    this.animacion(true, false);
    const animation5: Animation = this.animationCtrl.create('bouceEduardohome')
    .addElement(this.div2.nativeElement)
    .duration(350)
    .delay(0)
    .easing(' cubic-bezier(0.61, 1, 0.88, 1)')
  // .beforeStyles({bottom:'-16vh'})
  // .afterStyles({bottom:'-16vh'})
  //   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
    // .fromTo('transform', 'translate3d(0, 67vh, 0)', 'translate3d(0, 0vh, 0)');
    .keyframes([{ offset: 0, transform: 'translate3d(0, -6vh, 0)' },
  
  { offset: 1, transform: 'translate3d(0, 60vh, 0)' }, ]);
  
  
    animation5.play();
    this.animacionButonSlide(false);
  } else {
    this.div2.nativeElement.click();
    this.IonContentScroll.scrollToPoint(0, 0, 400);
  }
    this.div2.nativeElement.click();
    this.IonContentScroll.scrollToPoint(0, 0, 400);
  }

librosDescargados(Libros) {
    this.libros = Libros;
    this.codigoVisible = false;
    this.numeroclicks=1;
    this.pillMenu.nextSegment('0');
}


 async  animacionBounce(esHaciaArriba: boolean) {

   /*

const animation5: Animation = this.animationCtrl.create('bouceEduardo')
    .addElement(this.div2.nativeElement)
    .duration(700)
    .delay(0)
// .beforeStyles({bottom:'-16vh'})
 // .afterStyles({bottom:'-16vh'})
 //   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
 //   .fromTo('transform', 'translate3d(0, 40px, 0)', 'translate3d(0, 35px, 0)');
   .keyframes([{ offset: 0, transform: 'translate3d(0, 0px, 0)' },
 { offset: 0.7, transform: 'translate3d(0, 8px, 0)' },
 { offset: 1, transform: 'translate3d(0, 0px, 0)' }, ]);

await animation5.play();
this.content.scrollToPoint(0, 11,0);

this.renderer.addClass(this.div2.nativeElement, 'quitarBottom');


   //  animation5.destroy();
   // animation5.stop();
  //  animation5.destroy();
*/
let duracion;

if(!this.platform.is("ipad") || !this.platform.is("iphone") || !this.platform.is("ios")){
   //console.log("android")
   duracion= 700;
}
else{
  duracion= 700;
}
if (esHaciaArriba) {
const animation5: Animation = this.animationCtrl.create('bouceEduardo-b')
    .addElement(this.div2.nativeElement)
    .duration(600)	
    .delay(10)	
    //para android .easing('cubic-bezier(0,.70,.45,1)')	
    .easing('cubic-bezier(.42,.97,.52,1.1)')	
     .beforeStyles({height: '80vh'})	
     .afterStyles({height: '74vh'})	
     .keyframes([{ offset: 0, transform: 'translate3d(0, 60vh, 0)' },	
     { offset: 0.7, transform: 'translate3d(0, -10.5vh, 0)' },	
     { offset: 0.8, transform: 'translate3d(0, -8.5vh, 0)' },	
     { offset: 0.9, transform: 'translate3d(0, -6.5vh, 0)' },	
     { offset: 1, transform: 'translate3d(0, -7vh, 0)' }, ]);	
   // .fromTo('transform', 'translate3d(0, 67vh, 0)', 'translate3d(0, -7vh, 0)')	
    // .fromTo('transform', 'translate3d(0, 67vh, 0)', 'translate3d(0, 0vh, 0)');	
  /*   .keyframes([{ offset: 0, transform: 'translate3d(0, 60vh, 0)' },	
     { offset: 0.6, transform: 'translate3d(0, -10.5vh, 0)' },	
     { offset: 0.9, transform: 'translate3d(0, -5.0vh, 0)' },	
     { offset: 1, transform: 'translate3d(0, -7vh, 0)' }, ]);*/





   //  this.gesture.enable(false);
animation5.play();
this.pillMenu.animacion();
   // this.scrollenable=true;


      // this.renderer.addClass(this.toolbar2.nativeElement, 'inverted-border-radius');
  //    this.gesture.enable(true);



    } else {
     // this.scrollenable=false;
      const animation5: Animation = this.animationCtrl.create('bouceEduardo-c')
  .addElement(this.div2.nativeElement)
  .duration(350)
  .delay(0)
  .easing(' cubic-bezier(0.61, 1, 0.88, 1)')
// .beforeStyles({bottom:'-16vh'})
// .afterStyles({bottom:'-16vh'})
//   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
.fromTo('transform', 'translate3d(0, -6vh, 0)', 'translate3d(0, 60vh, 0)');
  // this.content.scrollToPoint(0, 0, 0);
      this.gesture.enable(false);
 //  this.scrollenable=false;

      await animation5.play();
      this.gesture.enable(true);


    }
    this.IonContentScroll.scrollToPoint(0, 0, 0);


  }
  detalle() {

  }

  scrollToUp(){
    this.IonContentScroll.scrollToPoint(0, 0, 0);
  }


  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {

    //  console.log(this.div1);
     // console.log(this.items);
     // let status bar overlay webview
   //  this.statusBar.overlaysWebView(true);
    console.log("Es celular:",this.globalServicies.isMobileDevice())
    this.isMobile =this.globalServicies.isMobileDevice();
     // set status bar to white
     this.statusBar.backgroundColorByHexString('--ion-color-principal');
     // this.statusBar.backgroundColorByHexString('#6228cf');
      this.llenar_libros();
      this.selectSeccion = 1;
    //  this.statusBar.hide();

      this.pillMenu.visibleFab(false);

      this.observer = new IntersectionObserver((entries) => {

        entries.forEach((entry: any) => {
          if (!entry.isIntersecting) {
            this.pocisionInicial = false;
            this.gesture3.enable(false);
          } else {
            this.pocisionInicial = true;
            this.gesture3.enable(true);
          }
        });
      }, {threshold: 0});

      this.observer.observe(this.elementsToProcess.nativeElement);
      setTimeout(() => {
        if(!this.platform.is("ipad") || !this.platform.is("iphone") || !this.platform.is("ios")){
          this.statusBar.show();
         // this.statusBar.backgroundColorByHexString('#6228cf');
      
         this.statusBar.backgroundColorByHexString('--ion-color-principal');
       }
       else{
        this.statusBar.hide();
        }

      }, 500);
     

    }
    async  ionSlideTouchStart() {

     if (this.estadoArriba) {

       //this.slideUp.lockSwipes(true);

      } else {

      //this.slideUp.lockSwipes(false);
      }

    }
    async ionSlideTouchEndSlide() {
      let index = await this.slideUp.getActiveIndex();

      // Por mientras
      index = index === 7 ? 1 : index;
      index = index === 0 ? 6 : index;
      /*index = index === 6 ? 1 : index;
      index = index === 0 ? 5 : index;*/
      this.header = this.headersText[index - 1];
      this.nombreIcono ='assets/img/'+ this.iconos[index - 1];


      if (index === 1) {
        //this.tabs = ['Todos', 'Inglés'  , 'Español', 'Código'];
        this.tabs = ['Todos', 'Inglés'  , 'Español'];

      } else if (index === 2) {
        if(this.getKeyToken('tipo')=='Profesor') 
          this.tabs = ['Tareas', 'Foro', 'Recursos'];
        else
          this.tabs = ['Tareas', 'Foro', 'Recursos', 'Evidencias'];

        this.pildora = 'Tareas';
     } else if (index === 3) {
        this.tabs = ['Noticias', 'Mensajes', 'Calendario'];

        this.pildora = 'Noticias';
     } else if (index === 4) {
        this.tabs = ['Perfil', 'Materias', 'Estadísticas'];
     } else if (index === 5) {
        this.tabs = ['Preguntas', 'Contacto'];
      } else if (index === 6) {
        //this.tabs = ['Examenes', 'Estadísticas'];
        this.tabs = ['Examenes'];

        this.pildoraExamenes="Examenes";
      }

      this.selectOption = '0';
      // console.log(await this.slideDown.getActiveIndex().toString());
      // this.pillMenu.nextSegment((await this.slideDown.getActiveIndex()).toString());


      this.selectSeccion = index;
      
      if (index === 1) {
         this.fabVisible = false; /*this.pillMenu.visibleFab(false);*/ 
         this.renderer.setStyle(this.fabend.nativeElement,'display','none');
         this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
      } 
      else if (index === 2) { 
         this.fabVisibleFilters = true; /*this.pillMenu.visibleFabFilters(true)*/ 
         if(this.getKeyToken('tipo')=='Profesor')
          this.renderer.setStyle(this.fabend.nativeElement,'display','block');

        this.renderer.setStyle(this.fabstart.nativeElement,'display','block');
      } 
      else if (index === 3) { 
        this.fabVisibleFilters = true; /*this.pillMenu.visibleFabFilters(true)*/ 
          
        this.renderer.setStyle(this.fabend.nativeElement,'display','none');
        this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
     } 
     else if (index === 6) { 
        this.fabVisibleFilters = true; /*this.pillMenu.visibleFabFilters(true)*/ 
        if(this.getKeyToken('tipo')=='Profesor')
        this.renderer.setStyle(this.fabend.nativeElement,'display','block');

        this.renderer.setStyle(this.fabstart.nativeElement,'display','block');
     }
     else { 
          this.fabVisibleFilters = false; /*this.pillMenu.visibleFabFilters(false)*/ 
          this.renderer.setStyle(this.fabend.nativeElement,'display','none');
          this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
      }

      //Si el usuario es un director disfrazado de otro usuario bloquea los add
      if(this.getKeyToken("estatus")!=undefined) {
          this.renderer.setStyle(this.fabend.nativeElement,'display','none');
          //this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
      }

    }

    activarEventoTouch(){
      

      this.gesture2 = this.gestureCtrl.create({
          el: this.calendar.nativeElement,
          gestureName: 'calendar',
          direction: 'y',
          threshold: 0.5,
          onStart: (detail) => {
            
  
            //this.gesture.disabled();
            //  this.renderer.setStyle(this.div2.nativeElement, 'transition', `none`);
          },
          onMove: (detail) => {
        
            //  this.gesture.disabled();
            },
        });
      this.gesture2.enable();
  }

    ionSlideTransitionStart() {
      setTimeout(() => {
        this.numeroclicks=1;
        this.pillMenu.nextSegment('0');
      }, 50);

      // this.pillMenu.nextSegment('0');
    }

    ionViewWillEnter() {
      this.user.nombre = this.capitalizeFirstLetter(this.getKeyToken('nombre').split(' ')[0]);
      //let nombre = this.capitalizeFirstLetter(this.user.nombre.split(' ')[0]);
      //console.log(nombre);
      if(this.getKeyToken('tipo')=='Profesor')
        this.user.grado = `Prof.`;
      else
        this.user.grado = `0${this.getKeyToken('grado')}°`;
    }

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();
    }

    ionViewDidEnter() {
      console.log("ionViewDidEnter");
      setTimeout(async () => {
        const status = this.webSocket.getStatusSocket() == 1 ? true : false;
        this.inforConnectionScoket(status);
        if(status==true) {
          //this.LstTareas = await this.apiTareas.get().toPromise();
        }
        else
        {
          //console.log("listo");
          this.slideUp.lockSwipes(true);
        }

        

      }, 100);

    }


    async ngOnInit() {
      console.log("home principal");
      this.subscribeToEvents();
     // this.statusBar.backgroundColorByHexString('#6228cf');
      this.statusBar.backgroundColorByHexString('--ion-color-principal');
      

      //this.LstTareas = await this.apiTareas.get().toPromise();

      this.iconos = ['books_icono.svg', 'tasks_icono.svg', 'community_icono.svg', 'account_icono.svg', 'support_icono.svg','exams_icono.svg'];
      this.headersText = ['Books', 'Tasks', 'Community', 'Account', 'Support','Exams'];
      this.tabs = ['Todos', 'Inglés'  , 'Español'];

      this.gesture = this.gestureCtrl.create({

        el: this.contentref.nativeElement,
        gestureName: 'test-swipe',
        direction: 'y',
        threshold: 8,
        passive: true,
        disableScroll: true,
        onStart: (detail) => {

          //  this.renderer.setStyle(this.div2.nativeElement, 'transition', `none`);
        },
        onMove: (detail) => {
        
          if (detail.velocityY < -0.50) {
            this.swipeUp = true;
            //console.log("onmoveUp");
          //  this.scrollenable = false
          
           }else{
            //console.log("onmoveDown");
            this.swipeDown = true;
        //    this.scrollenable = false;
            }

        },
        onEnd: (detail) => {
         //   this.scrollenable = false;
            //console.log("Entro al on end swipe content");
            //console.log("SwipeDown",this.swipeDown);
            if (this.swipeUp === true && !this.estadoArriba) {
              
              this.divArriba();
        /*     this.swipeUp = true;
             this.animacion(false, true);
             this.div2.nativeElement.click();
             this.estadoArriba = true;
             this.scrollenable = true;
             this.div2.nativeElement.click();
            this.pocisionInicial === true;
            */


           } else {
              if (this.swipeDown === true && this.estadoArriba) {

               // this.divAbajo();
             /*  this.gesture.enable(true);	

               this.gesture.enable(true);
               //console.log("entro al if de swipeDown")
             //   if (this.pocisionInicial === true) { causante del problema que no bajaba cuando haciamos swipe para abajo
             //     this.gesture.enable(false);
             //    this.renderer.setStyle(this.div2.nativeElement, 'touch-action', 'none');
               this.div2.nativeElement.click();
               this.scrollenable = false;
              
               this.animacion(true, true); 
             //    this.scrollenable = false;
               this.estadoArriba = false;
              */
             }
            }
            this.swipeUp = false;
            this.swipeDown = false;
          }
      });

      this.gesture.enable();

      this.gesture3 = this.gestureCtrl.create({

        el: this.div2.nativeElement,
        gestureName: 'test-swipedown',
        direction: 'y',
        threshold: 20,
        passive: true,
        disableScroll: true,
        onStart: (detail) => {

          //  this.renderer.setStyle(this.div2.nativeElement, 'transition', `none`);
        },
        onMove: (detail) => {
        
          if (detail.velocityY < -0.50) {
            this.swipeUp2 = true;
            //console.log("onmoveUp");
          //  this.scrollenable = false
          
           }else{
            //console.log("onmoveDown");
            this.swipeDown2 = true;
        //    this.scrollenable = false;
            }

        },
        onEnd: (detail) => {
         //   this.scrollenable = false;
            //console.log("SwipeUP",this.swipeUp);
            //console.log("SwipeDown",this.swipeDown);
            
            if (this.swipeUp2 === true && !this.estadoArriba) {
              console.log("this.swipeUp2 === true && !this.estadoArriba Uppppp");
            //  this.divArriba();
          /*   this.swipeUp2 = true;
                          this.div2.nativeElement.click();
             this.estadoArriba = true;
             this.scrollenable = true;
             this.div2.nativeElement.click();
            this.pocisionInicial === true;
             this.animacion(false, true);
             this.div2.nativeElement.click();
             this.estadoArriba = true;
             this.scrollenable = true;
             this.div2.nativeElement.click();
            this.pocisionInicial === true;
            */


           } else {
              if ((this.swipeDown2 === true && this.estadoArriba)&& this.swipeUp2=== false) {
                console.log("this.swipeDown2 === true && this.estadoArriba)&& this.swipeUp2=== false down");
                this.divAbajo();
             /*  this.gesture.enable(true);	

               this.gesture.enable(true);
               //console.log("entro al if de swipeDown")
             //   if (this.pocisionInicial === true) { causante del problema que no bajaba cuando haciamos swipe para abajo
             //     this.gesture.enable(false);
             //    this.renderer.setStyle(this.div2.nativeElement, 'touch-action', 'none');
               this.div2.nativeElement.click();
               this.scrollenable = false;
              
               this.animacion(true, true); 
             //    this.scrollenable = false;
               this.estadoArriba = false;
              */
             }
            }
            this.swipeUp2 = false;
            this.swipeDown2 = false;
          }
      });

      this.gesture3.enable();

      this.animacionFlechaArriba();
      
      
    }

    async buscarPortadas(){
      console.log("buscarPortadas");
      //Verifica conexion con el servidor
      const status = this.webSocket.getStatusSocket() == 1 ? true : false;
      
      if(status=== false) {
        setTimeout(() => {
          this.booksComponent.iniciarValidacion();
          this.booksComponentIngles.iniciarValidacion();
          this.booksComponentEspanol.iniciarValidacion();          
        }, 1500);

        return;
      }

      if(!this.platform.is('cordova')){
        setTimeout(() => {
          this.booksComponent.iniciarValidacion();
          this.booksComponentIngles.iniciarValidacion();
          this.booksComponentEspanol.iniciarValidacion();          
        }, 1500);
        return;
      }

      const versionPortadas =await this.storage.get("versionPortadas");

      const data =await this.apiPortadas.getPortadasVersion().toPromise();

      if(versionPortadas==null){
        console.log(data["version"]);
        console.log(data["url"]);
        this.download(data["url"],0,data["version"]);
      }
      else{
        console.log("versionPortadas",versionPortadas);
        if(parseInt(data["version"]) > parseInt(versionPortadas)) {
          console.log("update portadas");
          this.download(data["url"],versionPortadas,data["version"]);
        }
        else {
          setTimeout(() => {
            this.booksComponent.iniciarValidacion();
            this.booksComponentIngles.iniciarValidacion();
            this.booksComponentEspanol.iniciarValidacion();          
          }, 1500);
        }
      }
    }



    download(url,versionDevice,versionServer) {
      this.cargandoAnimation("Actualizando portadas");
      
      const fileTransfer: FileTransferObject = this.transfer.create();
  
      const nameFile ='covers.zip';
      //const directory = this.file.dataDirectory + "covers/";
      const directory = this.file.dataDirectory;
  
      //Descarga libro
      fileTransfer.download(url + versionDevice, directory + nameFile).then(entry => {
  
        //Descomprime libro
        console.log(entry.toURL());
        console.log(directory + 'covers');
        return this.zip.unzip(entry.toURL(), directory + 'covers');
      })
      .then(result =>{
        console.log(result);
        if(result === 0) { console.log('SUCCESS'); }
        if(result === -1) { console.log('FAILED'); }
  
        //Elimina zip para ahorrar espacio
        return this.file.removeFile(directory,nameFile);
      })
      .then( data =>{
        console.log(data);
        console.log("Terminado");
  
        this.storage.set("versionPortadas",versionServer).then( () => {
          console.log("guardo portadas");
          this.loadingController.dismiss();
          setTimeout(() => {
            this.booksComponent.iniciarValidacion();
            this.booksComponentIngles.iniciarValidacion();
            this.booksComponentEspanol.iniciarValidacion();          
          }, 1500);
        });
      })
      .catch(err => {
        console.error(err);
        /*alert(err);*/
        alert("Error con la conexión, por favor intente descargar de nuevo");

        this.loadingController.dismiss();
      });

    }

    segmentChanged(event) {
      //Limpia los filtros en cada cambio
      this.filtrosControl.value="";

      const itemOption = this.pillMenu.itemsMenu[event.detail.value];
      console.log(itemOption);
      this.pildora = itemOption;
      console.log(this.selectSeccion);
      if(itemOption == 'Estadísticas' && this.getKeyToken('tipo')=='Alumno'){
          this.appReport.cargarEstadisticas();
      }
      else if(itemOption == 'Estadísticas' && this.getKeyToken('tipo')=='Profesor'){
        console.log(this.getKeyToken('tipo'));
        this.appGraphics.cargarEstadisticas();
      }
     // console.log(itemOption);
      //Logica boton + evidencias
      if(this.selectSeccion==2) {
        this.IonContentScroll.scrollToPoint(0, 0, 0);
        /*if(this.getKeyToken('tipo')=='Alumno' && itemOption=="Evidencias") {
          this.renderer.setStyle(this.fabend.nativeElement,'display','block');
        } else*/ 
        /*if(this.getKeyToken('tipo')=='Profesor' && itemOption=="Evidencias") {
          this.renderer.setStyle(this.fabend.nativeElement,'display','none');
        } else*/

         if(this.getKeyToken('tipo')=='Profesor') {
          this.renderer.setStyle(this.fabend.nativeElement,'display','block');
        } else if(this.getKeyToken('tipo')=='Alumno') {
          this.renderer.setStyle(this.fabend.nativeElement,'display','none');
        }

        //Si el usuario es un director disfrazado de otro usuario bloquea los add
        if(this.getKeyToken("estatus")!=undefined) {
          console.log("entro this.getKeyToken");
          this.renderer.setStyle(this.fabend.nativeElement,'display','none');
          //this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
        }
      }

      if(this.selectSeccion==3) {
          if(this.getKeyToken('tipo')=='Alumno' && itemOption=="Mensajes") {
            this.renderer.setStyle(this.fabend.nativeElement,'display','block');
          } else
          if(this.getKeyToken('tipo')=='Profesor' && itemOption=="Evidencias") {
            this.renderer.setStyle(this.fabend.nativeElement,'display','block');
          } else
          if(this.getKeyToken('tipo')=='Profesor') {
            this.renderer.setStyle(this.fabend.nativeElement,'display','block');
          } else if(this.getKeyToken('tipo')=='Alumno') {
            this.renderer.setStyle(this.fabend.nativeElement,'display','none');
          }

          //Si el usuario es un director disfrazado de otro usuario bloquea los add
          if(this.getKeyToken("estatus")!=undefined) {
            this.renderer.setStyle(this.fabend.nativeElement,'display','none');
            this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
          }
      }

      console.log(this.selectSeccion);

       this.slideDown.slideTo(event.detail.value);
      // this.slideUp.slideTo(event.detail.value);
    } 

    ionChangeFiltros(event){
      //console.log(event);
      let filtro='';

      //console.log(event.detail.value.length);
      if(!Array.isArray(event.detail.value))
        return;
      
      event.detail.value.forEach((element,idx,array) => {
        if (idx === array.length - 1){ 
          filtro += element.Id;
        }
        else {
          filtro += element.Id + ",";
        }
      });

      console.log(filtro);

      this.IonContentScroll.scrollToPoint(0, 0, 0);

      const itemOption =this.pillMenu.itemsMenu[this.pillMenu.indexAnterior];

      console.log(event.detail.value.length);
      if(itemOption==="Tareas") {
        if (event.detail.value.length === 0) {
          this.tareasComponent.cargar(0);
        } else {
          //this.tareasComponent.cargar(event.detail.value[0].Id);
          this.tareasComponent.cargar(filtro);
        }
      }
      else if(itemOption==="Foro") {
        if (event.detail.value.length === 0) {
            this.forumComponent.cargar(0);
        } else {
           this.forumComponent.cargar(event.detail.value[0].Id);
        } 
      }
      else if(itemOption==="Recursos") {
        if (event.detail.value.length === 0) {
            this.resourceComponent.cargar(0);
        } else {
           this.resourceComponent.cargar(event.detail.value[0].Id);
        } 
      }
    }

    compareWith(o1: any, o2: any | any[]) {

      if (!o1 || !o2) {
        return o1 === o2;
      }
  
      if (Array.isArray(o2)) {
        return o2.some((u: any) => u.Id === o1.Id);
      }
  
      return o1.Id === o2.Id;
    }

    ngOnDestroy() {
      // Do something on page destroy
      console.log("ngOnDestroy");
    }

    async openPicker() {
      console.log("filtros");

      this.materias = await this.apiMaterias.get().toPromise();
      //console.log(this.materias);

      this.filtrosControl.open();
      return;

      const picker = await this.pickerController.create({
          mode : 'ios',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Aceptar',
              handler:  (value: any) => {
                  this.IonContentScroll.scrollToPoint(0, 0, 0);
                  const itemOption =this.pillMenu.itemsMenu[this.pillMenu.indexAnterior];
                  if(itemOption==="Tareas") {
                    
                    if (value.Meses.value === 0) {
                      this.tareasComponent.cargar(0);
                    } else {
                      this.tareasComponent.cargar(value.Meses.value);
                    }
                  }
                  else if(itemOption==="Foro") {
                    if (value.Meses.value === 0) {
                        this.forumComponent.cargar(0);
                    } else {
                       this.forumComponent.cargar(value.Meses.value);
                    } 
                  }
                  else if(itemOption==="Recursos") {
                    if (value.Meses.value === 0) {
                        this.resourceComponent.cargar(0);
                    } else {
                       this.resourceComponent.cargar(value.Meses.value);
                    } 
                  }
              }
            }
          ],
          columns: [{
              name: 'Meses',
              options: await this.getColumnOptionsMeses()
            }
          ]
      });
      
      picker.present();
  
    }

    async getColumnOptionsMeses() {
      const options = [];


      this.materias = await this.apiMaterias.get().toPromise();
    
      options.push({text: 'Todas' , value: 0});

      this.materias.forEach(x => {
        options.push({text: x.Nombre , value: x.Id});
      });
  
      return options;
    }

    async nuevoRecurso(itemOption) {
      
      itemOption = this.pillMenu.itemsMenu[this.pillMenu.indexAnterior];
      
      if (itemOption === 'Tareas') {
          const modal = await this.modalCrl.create({
            component: NuevoRecursoPage,
            // cssClass: 'my-custom-modal-css',
            cssClass: 'my-custom-modal-css-capturas',
            showBackdrop: false,
            mode: 'ios',
            backdropDismiss: true
          });

          await modal.present();

          modal.onDidDismiss().then( async (data) => {
              console.log(data);
              if(data.data.banderaEdito==true)
              {
                  /*await this.cargandoAnimation('Cargando...');
                  this.loadingController.dismiss();*/
                  this.tareasComponent.cargar(0);
              }
          });
      } else if (itemOption === 'Mensajes') {
        const modal = await this.modalCrl.create({
          component: CrearChatPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          // this.forumComponent.cargar();
        });

      } else if (itemOption === 'Recursos') {

        const modal = await this.modalCrl.create({
          component: NewResourcePage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          componentProps: {
            TipoRecurso : this.TipoSeleccionado
          },
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          if(data.data.banderaEdito==true)
          {
            this.resourceComponent.cargar(0);
          }
        });
      
      } else if (itemOption === 'Noticias') {
        const modal = await this.modalCrl.create({
          component: CrearNewsPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.newsComponent.cargar();
        });

      }else if (itemOption === 'Foro') {
        const modal = await this.modalCrl.create({
          component: CrearForumPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.forumComponent.cargar(0);
        });

      }
      else if (itemOption === 'Evidencias') {
        const modal = await this.modalCrl.create({
          component: CrearEvidencePage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.evidenceComponent.cargar();
        });

      }
      else if (itemOption === 'Calendario') {
        const modal = await this.modalCrl.create({
          component: CrearTopicPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          await this.cargandoAnimation('Cargando...');

          this.apiCalendario.getCalendario().subscribe(data => {
            
            this.events = data;
            this.loadingController.dismiss();
          });
        });
      }
      else if(itemOption == 'Examenes') {
        const modal = await this.modalCrl.create({
          component: CrearExamenPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {

          console.log(data);
          if(data.data.banderaEdito==true)
          {
              /*await this.cargandoAnimation('Cargando...');
              this.loadingController.dismiss();*/
              this.examenesComponent.cargar(0);
          }
        });
      }
    }

   async abrirCalendarioSemana(item){
      console.log("abrirCalendarioSemana");
      const modal = await this.modalCrl.create({
        component: CalendarEventsPage,
        // cssClass: 'my-custom-modal-css',
        cssClass: 'my-custom-modal-css-capturas',
        showBackdrop: false,
        mode: 'ios',
        backdropDismiss: true,
        componentProps: {item}
      });

      await modal.present();

      modal.onDidDismiss().then( async (data) => {
        if(data.data != undefined) {
          await this.cargandoAnimation('Cargando...');
          this.apiCalendario.getCalendario().subscribe(data => {
            console.log("getCalendario");
            this.events = data;
            this.loadingController.dismiss();
          },error =>{ 
            console.log(error);
            this.loadingController.dismiss();
          });
        }
      });

    }

    async cargandoAnimation(text) {
      this.loading = await this.loadingController.create({
        message: text,
        duration: 60000
      });

      await this.loading.present();
    }

    async ionSlideTouchEnd(slideSelect: IonSlides, notSlideSlect: IonSlides) {
      // notSlideSlect.slideTo(await slideSelect.getActiveIndex());
      //console.log(await (await this.slideDown.getActiveIndex()).toString());
      const index =await (await this.slideDown.getActiveIndex()).toString();
      //const itemOption = this.pillMenu.itemsMenu[index];

      this.pillMenu.nextSegment(index);
    }



    clickDiv() {
     // console.log("Click Div")

    }

    clickHoyCalendario(){
      console.log("clickHoyCalendario");
      this.mobi.instance.navigate(new Date(Date.now()), true);
    }

    clickCalendario(){

    }

    ////// logica libros quitar cuando se cuando se cambie a componente
    llenar_libros() {

      // this.libros = this.booksService.getPost();
    }

    updateAutoHeightSlider(){
      console.log("updateAutoHeightSlider");
      this.slideDown.updateAutoHeight();
    }

    async Salir() {
      //Busca si se existe un sesion del director iniciada
      const jwt_temp = localStorage.getItem('USER_INFO_TEMP');
  
      if(jwt_temp != null)
      {
          localStorage.clear();
          localStorage.setItem('USER_INFO',jwt_temp);
          /*this.storage.remove("books" + this.getKeyToken("id")).then(() => {
            this.router.navigate(['home-director']);
          });*/
          this.router.navigate(['home-director']);
          return;
      }

      const alert = await this.alertController.create({
        header: 'LBS Plus',
        message: '<strong>¿Desea cerrar sesión?</strong>',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {

            }
          }, {
            text: 'Si',
            handler: () => {
              /*this.storage.remove("books2020").then(() => {
                this.authenticationService.logout().then( data => {
                  this.webSocket.finishWebScoket();
                });
              });*/
              
              this.authenticationService.logout().then( data => {
                this.webSocket.finishWebScoket();
              });
              // this.menu.close();
            }
          }
        ]
      });

      await alert.present();
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

    private subscribeToEvents(): void {
      this.webSocket.connectionEstablished.subscribe((status: any) => {
          this.inforConnectionScoket(status);
      });
    }

    public async inforConnectionScoket(status) {
      if (status == true) {
            console.log("status");
            try {
              if(this.pushService.userId != undefined)
                await this.apiDevice.update(this.pushService.userId).toPromise();
            } catch (error) {
              console.error(error);
              // expected output: ReferenceError: nonExistentFunction is not defined
              // Note - error messages will vary depending on browser
            }

            console.log("this.hayConexion = true;");
            this.hayConexion = true;
            this.renderer.setStyle(this.avatarUser.nativeElement, 'color', `#FF426D`);
            this.slideUp.lockSwipes(false);
            //this.LstTareas = await this.apiTareas.get().toPromise();
      } else {
            this.hayConexion = false;
            this.renderer.setStyle(this.avatarUser.nativeElement, 'color', `black`);
      }
    }
    public tamañoMover(): number{	
      let numberMover = 0;	
      if (this.platform.width() >= 250 && this.platform.width() <= 299) {numberMover = 1; }	
      if (this.platform.width() >= 300 && this.platform.width() <= 349) {numberMover = 2; }	
      if (this.platform.width() >= 350 && this.platform.width() <= 399) {numberMover = 3; }	
      if (this.platform.width() >= 400 && this.platform.width() <= 449 ) {numberMover = 4; }	
      if (this.platform.width() >= 450 && this.platform.width() <= 499) {numberMover = 5; }	
      if (this.platform.width() >= 500 && this.platform.width() <= 549 ) {numberMover = 6; }	
      if (this.platform.width() >= 550 && this.platform.width() <= 599) {numberMover = 7; }	
      if (this.platform.width() >= 600 && this.platform.width() <= 649 ) {numberMover = 8; }	
      if (this.platform.width() >= 650 && this.platform.width() <= 699 ) {numberMover = 9; }	
      if (this.platform.width() >= 700 && this.platform.width() <= 749 ) {numberMover = 10; }	
      if (this.platform.width() >= 750 && this.platform.width() <= 799 ) {numberMover = 11; }	
      if (this.platform.width() >= 800 && this.platform.width() <= 849 ) {numberMover = 12; }	
      if (this.platform.width() >= 850 && this.platform.width() <= 899 ) {numberMover = 13; }	
      if (this.platform.width() >= 900 && this.platform.width() <= 949 ) {numberMover = 14; }	
      if (this.platform.width() >= 950 && this.platform.width() <= 999 ) {numberMover = 15; }	
      if (this.platform.width() >= 1000 && this.platform.width() <= 1049  ) {numberMover = 16; }	
      if (this.platform.width() >= 1050 && this.platform.width() <= 1099 ) {numberMover = 17; }	
      if (this.platform.width() >= 1100 && this.platform.width() <= 1149 ) {numberMover = 18; }	
      if (this.platform.width() >= 1150 && this.platform.width() <= 1199 ) {numberMover = 19; }	
      if (this.platform.width() >= 1200 && this.platform.width() <= 1249 ) {numberMover = 20; }	
      if (this.platform.width() >= 1250 && this.platform.width() <= 1299 ) {numberMover = 21; }	
      if (this.platform.width() >= 1300 && this.platform.width() <= 1349 ) {numberMover = 22; }	
      if (this.platform.width() >= 1350  ) {numberMover = 23; }	
      //console.log(numberMover);	
      return numberMover;	
  }	
  public test(){	
    //temporal: variable e if temporal; cuando se inicia la aplicaion hace dos veces click	
  
    if (this.numeroclicks>=2 && !this.estadoArriba){	
      setTimeout(() => {	
        this.divArriba(); 	
      }, 200);	
        
    } 	
    this.numeroclicks++      	
  }

  divArriba(){	
    	

  if(this.estadoArriba===false){	
    //console.log("divArriba")
    this.slideUp.lockSwipes(true);
    this.swipeUp2 = true;
    this.animacion(false, true);
    this.div2.nativeElement.click();
    this.estadoArriba = true;
    this.scrollenable = true;
    this.div2.nativeElement.click();
   this.pocisionInicial === true;
   this.animacionButonSlide(true);
  }
 }
 divAbajo(){	
  console.log("divAbajo")
  this.gesture.enable(true);	

  this.gesture.enable(true);
  //console.log("entro al if de swipeDown")
//   if (this.pocisionInicial === true) { causante del problema que no bajaba cuando haciamos swipe para abajo
//     this.gesture.enable(false);
//    this.renderer.setStyle(this.div2.nativeElement, 'touch-action', 'none');
  this.div2.nativeElement.click();
  this.scrollenable = false;
 
  this.animacion(true, true); 
  this.animacionButonSlide(false);
//    this.scrollenable = false;
  this.estadoArriba = false;
  this.slideUp.lockSwipes(false);
// }
 }





    public permisoEditar() {
      /*const jwt_temp = localStorage.getItem('USER_INFO_TEMP');
      if(jwt_temp != null)
      {
          return false;
      }*/
      
      if(this.getKeyToken('tipo')=='Profesor')
        return true;
      else
        return false;
    }

    nextSlide(){
      this.slideUp.slideNext();
      this.ionSlideTouchEndSlide();
    }

    prevSlide(){
      this.slideUp.slidePrev();
      this.ionSlideTouchEndSlide();
    }

    animacionButonSlide(esHaciaArriba){
      if(this.isMobile==true) 
          return;

      let animationButonSlide : Animation;
      if(esHaciaArriba){
         
      animationButonSlide = this.animationCtrl.create('animationButonSlide')
      .addElement([this.fabNext.nativeElement,this.fabPrev.nativeElement])
      .duration(200)
      .delay(0)
      .easing('cubic-bezier(.12,0,.39,0)')
     .keyframes([{ offset: 0, transform: 'scale(1)' },
     { offset: 1, transform: 'scale(0)' }, ]);
    }
    else{

      animationButonSlide = this.animationCtrl.create('animationButonSlide-b')
      .addElement([this.fabNext.nativeElement,this.fabPrev.nativeElement])
      .duration(700)
      .delay(20)
      .easing('cubic-bezier(.61,1,.88,1)')
     .keyframes([{ offset: 0, transform: 'scale(0)' },
     { offset: 0.2, transform: 'scale(1)' },
     { offset: 0.5, transform: 'scale(1.3)' },
     { offset: 1, transform: 'scale(1)' }, ]);

    }
     animationButonSlide.play();

    }

    animacionFlechaArriba(){
      let animationFlechaArriba : Animation;

      animationFlechaArriba= this.animationCtrl.create('animationFlechaArriba')
      .addElement(this.fabflechaarriba.nativeElement)
      .duration(1500)
      .iterations(Infinity)
      .fromTo('transform', 'translateY(0px)', 'translateY(-70px)')
      .fromTo('opacity', '1', '0.2');

   //   animationFlechaArriba.play();


    }

    changeIonChipRecursos(data){
      this.TipoSeleccionado = data;
      console.log(this.TipoSeleccionado);
    }
 
}

const lorem = 'Lorem iuis aute irure dol cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const images = [
  'bandit',
  'batmobile',
  'blues-brothers',
  'bueller',
  'delorean',
  'eleanor',
  'general-lee',
  'ghostbusters',
  'knight-rider',
  'mirth-mobile'
];

function getImgSrc() {
  const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
  // tslint:disable-next-line: no-use-before-declare
  rotateImg++;
  if (rotateImg === images.length) {
    rotateImg = 0;
  }
  return src;
}

let rotateImg = 0;
