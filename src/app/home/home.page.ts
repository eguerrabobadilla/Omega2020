import { Component, ElementRef, ViewChild, Renderer2, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { AnimationController, Animation, IonContent, Platform, IonSlides, ModalController, LoadingController, AlertController } from '@ionic/angular';
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
  selectOption = '0';
  selectSeccion = 1;
  index: number ;
  libros: any[] = [];
  librosES: any[] = [];
  librosIN: any[] = [];
  codigoVisible = true;
  LstTareas: any[] = [];

  @ViewChild('slideDown', {static: false}) slideDown: IonSlides;
  @ViewChild('slideUp', {static: true}) slideUp: IonSlides;
  @ViewChild('slideVertical', {static: true}) slideVertical: IonSlides;
  @ViewChild('toolbar', {read: ElementRef, static: true}) toolbar: ElementRef;
  @ViewChild('toolbar1', {read: ElementRef, static: true}) toolbar1: ElementRef;
  @ViewChild('text', {read: ElementRef, static: true}) text: ElementRef;
  @ViewChild('elementsToProcess', {read: ElementRef, static: true}) elementsToProcess: ElementRef;
  @ViewChild('toolbar2', {read: ElementRef, static: true}) toolbar2: ElementRef;
  @ViewChild('content', {static: true}) content: IonContent;
  @ViewChild('content', {read: ElementRef, static: true}) contentref: ElementRef;
  @ViewChild('content2', {read: ElementRef, static: true}) contentref2: ElementRef;
  @ViewChild('div2', {read: ElementRef, static: true}) div2: ElementRef;
  @ViewChild('footer', {read: ElementRef, static: true}) footer: ElementRef;
  @ViewChild('fab', {read: ElementRef, static: true}) fab: ElementRef;
  @ViewChild('foot', {read: ElementRef, static: true}) foot: ElementRef;
  @ViewChild('animation7', {read: ElementRef, static: true}) animation7: ElementRef;
  @ViewChild('animation8', {read: ElementRef, static: true}) animation8: ElementRef;
  @ViewChild('pillMenu', {static: false}) pillMenu: PillMenuComponent;
  @ViewChild('pillMenu', {read: ElementRef, static: false}) pillMenuRef: ElementRef;
  @ViewChild('forumComponent', {static: false}) forumComponent: ForumComponent;

  items: any[] = [];
  estadoArriba  = false;
  primeraVez = true;
  headersText: any = [];
  header = 'Books';
  nombreIcono = 'people-outline';
  iconos: any[];
  public swipeUp = false;
  public swipeDown = false;
  public gesture;
  public gesture2;
  slideOpts = {
    loop: true,
  };

  // tslint:disable-next-line: max-line-length
  constructor(private statusBar: StatusBar, public platform: Platform, private animationCtrl: AnimationController,
              // tslint:disable-next-line: max-line-length
              private renderer: Renderer2, private gestureCtrl: GestureController, private modalCrl: ModalController, private booksService: BooksService,
              private loadingController: LoadingController, private alertController: AlertController,private authenticationService: AuthenticationService ,
              private apiTareas: TareasService) {
      this.scrollenable = true;



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

    if (!isRegreso) {
   //   console.log("animacion arriba")
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
      animation2 = this.animationCtrl.create('my-animation-identifier2')
    .addElement(this.toolbar.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(0)', 'translateY(-3vh)');

      animation4 = this.animationCtrl.create('my-animation-identifier4')
    .addElement(this.toolbar1.nativeElement)
    .beforeAddClass('colortoolbarUP')
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(0)', 'translateY(-7vh)');

      animation3 = this.animationCtrl.create('my-animation-identifier3')
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




      animation6 = this.animationCtrl.create('my-animation-identifier3')
    .addElement(this.fab.nativeElement)
    .afterAddClass('zindexFooter')
    .duration(700)
    .delay(20)
    .easing('cubic-bezier(.61,1,.88,1)')
   .keyframes([{ offset: 0, transform: 'scale(0)' },
   { offset: 0.2, transform: 'scale(1)' },
   { offset: 0.5, transform: 'scale(1.3)' },
   { offset: 1, transform: 'scale(1)' }, ]);

      animation7 = this.animationCtrl.create('my-animation-identifier3')
   .addElement(this.animation7.nativeElement)
   .duration(300)
   .delay(50)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', ' perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)', 'perspective(1px) translateY(-18vh) translateZ(0) translateX(-7vw) scale(0.6)');

      animation8 = this.animationCtrl.create('my-animation-identifier3')
   .addElement(this.animation8.nativeElement)
   .duration(300)
   .delay(40)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', '  translate(0, 0)', ' translate(-2vw, -15.5vh)');


      animation2.play();
      animation3.play();
      animation4.play();
    //  animation5.play();
      animation6.play();
      animation7.play();
      animation8.play();

     // if (click) {
      this.moveScroll(true);
    //  this.scrollenable = true;
      this.animacionBounce(true);

      // }
      this.estadoArriba = true;
  } else {
  //  console.log("animacion abajo")

    this.moveScroll(false);
    if (this.estadoArriba === false ) { return; }
  //  this.renderer.removeClass(this.toolbar2.nativeElement, 'inverted-border-radius');
  //  this.renderer.removeClass(this.foot.nativeElement, 'sombraFooter');
    this.pillMenu.quitarSombra();
    animation2 = this.animationCtrl.create('my-animation-identifier2')
    .addElement(this.toolbar.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(-3vh)', 'translateY(0)');

    animation4 = this.animationCtrl.create('my-animation-identifier4')
    .addElement(this.toolbar1.nativeElement)
    .beforeAddClass('colortoolbarDOWN')
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(-7vh)', 'translateY(0)');


    animation3 = this.animationCtrl.create('my-animation-identifier3')
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




    animation6 = this.animationCtrl.create('my-animation-identifier3')
    .addElement(this.fab.nativeElement)
    .afterAddClass('zindexFooter')
    .duration(200)
    .delay(0)
    .easing('cubic-bezier(.12,0,.39,0)')
   .keyframes([{ offset: 0, transform: 'scale(1)' },

   { offset: 1, transform: 'scale(0)' }, ]);

    animation7 = this.animationCtrl.create('my-animation-identifier3')
   .addElement(this.animation7.nativeElement)
   .duration(300)
   .delay(50)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', 'perspective(1px) translateY(-18vh) translateZ(0) translateX(-7vw) scale(0.6)', ' perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)');

    animation8 = this.animationCtrl.create('my-animation-identifier3')
   .addElement(this.animation8.nativeElement)
   .duration(280)
   .delay(0)
   .fromTo('transform' , 'translate(-2vw, -15.5vh)', 'translate(0, 0)');



    animation2.play();
    animation3.play();
    animation4.play();
 //   animation5.play();
    animation6.play();
    animation7.play();
    animation8.play();
    this.animacionBounce(false);
    this.estadoArriba = false;



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
  const animation5: Animation = this.animationCtrl.create('bouceEduardo')
  .addElement(this.div2.nativeElement)
  .duration(350)
  .delay(0)
  .easing(' cubic-bezier(0.61, 1, 0.88, 1)')
// .beforeStyles({bottom:'-16vh'})
// .afterStyles({bottom:'-16vh'})
//   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
  // .fromTo('transform', 'translate3d(0, 67vh, 0)', 'translate3d(0, 0vh, 0)');
   .keyframes([{ offset: 0, transform: 'translate3d(0, 0vh, 0)' },

{ offset: 1, transform: 'translate3d(0, 67vh, 0)' }, ]);


  animation5.play();
} else {
  this.div2.nativeElement.click();
  this.content.scrollToPoint(0, 0, 400);
}
  this.div2.nativeElement.click();
  this.content.scrollToPoint(0, 0, 400);
}

librosDescargados(Libros){
    console.log(Libros);
    this.libros = Libros;
    this.codigoVisible = false;
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
if (esHaciaArriba) {
const animation5: Animation = this.animationCtrl.create('bouceEduardo')
    .addElement(this.div2.nativeElement)
    .duration(1150)
    .delay(60)
    .easing(' cubic-bezier(0,.70,.45,1)')
// .beforeStyles({bottom:'-16vh'})
 // .afterStyles({bottom:'-16vh'})
 //   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
    // .fromTo('transform', 'translate3d(0, 67vh, 0)', 'translate3d(0, 0vh, 0)');
     .keyframes([{ offset: 0, transform: 'translate3d(0, 67vh, 0)' },
     { offset: 0.6, transform: 'translate3d(0, -0.5vh, 0)' },
     { offset: 0.9, transform: 'translate3d(0, .9vh, 0)' },
 { offset: 1, transform: 'translate3d(0, 0vh, 0)' }, ]);





   //  this.gesture.enable(false);
    animation5.play();
         this.pillMenu.animacion();
   // this.scrollenable=true;


      // this.renderer.addClass(this.toolbar2.nativeElement, 'inverted-border-radius');
  //    this.gesture.enable(true);



    } else {
     // this.scrollenable=false;
      const animation5: Animation = this.animationCtrl.create('bouceEduardo')
  .addElement(this.div2.nativeElement)
  .duration(350)
  .delay(0)
  .easing(' cubic-bezier(0.61, 1, 0.88, 1)')
// .beforeStyles({bottom:'-16vh'})
// .afterStyles({bottom:'-16vh'})
//   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
   .fromTo('transform', 'translate3d(0, 0vh, 0)', 'translate3d(0, 67vh, 0)');
  // this.content.scrollToPoint(0, 0, 0);
      this.gesture.enable(false);
 //  this.scrollenable=false;

      await animation5.play();
      this.gesture.enable(true);


    }



  }
  detalle() {

  }


  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {

    //  console.log(this.div1);
     // console.log(this.items);
     // let status bar overlay webview
   //  this.statusBar.overlaysWebView(true);

     // set status bar to white
      this.statusBar.backgroundColorByHexString('#FFFFFF');
      this.llenar_libros();
      this.selectSeccion = 1;
    //  this.statusBar.hide();



      this.observer = new IntersectionObserver((entries) => {

        entries.forEach((entry: any) => {
          if (!entry.isIntersecting) {
            this.pocisionInicial = false;
            this.gesture.enable(false);
          } else {
            this.pocisionInicial = true;
            this.gesture.enable(true);
          }
        });
      }, {threshold: 0});

      this.observer.observe(this.elementsToProcess.nativeElement);

    }
    async  ionSlideTouchStart() {

     if (this.estadoArriba) {

       this.slideUp.lockSwipes(true);

      } else {

      this.slideUp.lockSwipes(false);
      }

    }
    async ionSlideTouchEndSlide() {

      let index = await this.slideUp.getActiveIndex();

      // Por mientras
      index = index === 7 ? 1 : index;
      index = index === 0 ? 6 : index;
      this.header = this.headersText[index - 1];
      this.nombreIcono = this.iconos[index - 1];
      console.log("index");
      console.log(index);

      if (index === 1) {
        this.tabs = ['Todos', 'Inglés'  , 'Español', 'Código'];
        
      } else if (index === 2) {
        this.tabs = ['Tareas','Foro', 'Recursos'];
     } else if (index === 3) {
      this.tabs = ['Noticias', 'Mensajes', 'Calendario'];
            
     } else if (index === 4) {
            //this.tabs = ['Perfil', 'Clases', 'Usuarios', 'Estadísticas', 'Cerrar Sesión'];
            this.tabs = ['Perfil', 'Clases', 'Estadísticas'];
     }
     else if (index === 5) {
      this.tabs = ['Preguntas', 'Videos', 'Contacto'];
      }
      else if (index === 6) {
        this.tabs = ['Alumnos', 'Docentes', 'Cordinadores'];
        }

      this.selectOption = '0';
      console.log(await this.slideDown.getActiveIndex().toString());
      // this.pillMenu.nextSegment((await this.slideDown.getActiveIndex()).toString());


      this.selectSeccion = index;

      if (index === 1) {this.pillMenu.visibleFab(false); } else { this.pillMenu.visibleFab(true); }

    }

    ionSlideTransitionStart() {
      setTimeout(() => {
        this.pillMenu.nextSegment('0');
      }, 50);

      // this.pillMenu.nextSegment('0');
    }

    async ngOnInit() {

      this.LstTareas = await this.apiTareas.get().toPromise();
      console.log(this.LstTareas);
    

      this.iconos = ['people-outline', 'watch-outline', 'leaf-outline', 'shield-outline', 'leaf-outline'];
      this.headersText = ['Books', 'Tasks', 'Community', 'Account', 'Support', 'Users'];
      this.tabs = ['Todos', 'Inglés'  , 'Español', 'Código'];

      this.gesture = this.gestureCtrl.create({

        el: this.contentref.nativeElement,
        gestureName: 'test-swipe',
        direction: 'y',
        threshold: 0.5,
        disableScroll: true,
        onStart: (detail) => {
       //   console.log("onstart")
          //  this.renderer.setStyle(this.div2.nativeElement, 'transition', `none`);
        },
        onMove: (detail) => {
        //  console.log("onmove")
          if (detail.velocityY < -0.50) {

            this.swipeUp = true; } else {

         //   console.log(this.estadoArriba);
            this.swipeDown = true;
            }

        },
        onEnd: (detail) => {

           if (this.swipeUp === true && !this.estadoArriba) {
              this.swipeUp = true;
              this.animacion(false, true);
              this.div2.nativeElement.click();
              this.estadoArriba = true;
              this.scrollenable = true;
              this.div2.nativeElement.click();

           } else {
              if (this.swipeDown === true && this.estadoArriba) {


               if (this.pocisionInicial === true) {

                 this.scrollenable = false;
                 this.div2.nativeElement.click();
                 this.animacion(true, true);
                 this.scrollenable = false;
                 this.estadoArriba = false;
                }
             }
            }
           this.swipeUp = false;
           this.swipeDown = false;
          }
      });

      this.gesture.enable();




    }

    segmentChanged(event) {
       this.slideDown.slideTo(event.detail.value);
      // this.slideUp.slideTo(event.detail.value);
    }

    async nuevoRecurso(itemOption) {
      console.log("itemOption")
      console.log(itemOption)
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
              this.LstTareas = await this.apiTareas.get().toPromise();
              console.log(this.LstTareas);
          });
      } else if (itemOption === 'Foro') {
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
          this.forumComponent.cargar();
        });

      } else if (itemOption === 'Recursos') {
        const modal = await this.modalCrl.create({
          component: NewResourcePage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.forumComponent.cargar();
        });

      }
    }

    async ionSlideTouchEnd(slideSelect: IonSlides, notSlideSlect: IonSlides) {
      // notSlideSlect.slideTo(await slideSelect.getActiveIndex());
      this.pillMenu.nextSegment(await (await this.slideDown.getActiveIndex()).toString());
    }

    async openDetail(event: Event, item) {

    const modal = await this.modalCrl.create({
        component: DetallePage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        componentProps: {item}
      });
      
      return await modal.present();
    }


    clickDiv() {
     // console.log("Click Div")

    }

    ////// logica libros quitar cuando se cuando se cambie a componente
    llenar_libros() {
      console.log('llenar libros');
      // this.libros = this.booksService.getPost();
    }

    async Salir(){

      const alert = await this.alertController.create({
        header: 'LBS Plus Demo',
        message: '<strong>¿Desea cerrar sesión?</strong>',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Si',
            handler: () => {
              this.authenticationService.logout();
              //this.menu.close();
            }
          }
        ]
      });
  
      await alert.present();
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
