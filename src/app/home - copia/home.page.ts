import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { AnimationController, Animation, IonContent, Platform,IonSlides } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Gesture, GestureController } from '@ionic/angular';
import { PillMenuComponent } from '../components/pill-menu/pill-menu.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private observer: IntersectionObserver;
  scrollenable = false;
  tabs: any = [];
  selectOption: string = '0';
 

  @ViewChild('slideDown',{static:true}) slideDown: IonSlides;
  @ViewChild('slideUp',{static:true}) slideUp: IonSlides;
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
  @ViewChild('pillMenu',{static:true}) pillMenu: PillMenuComponent;

  items: any[] = [];
  estadoArriba: boolean;
  primeraVez = true;
  headersText:any =[]
  header: string="Community";
  nombreIcono : string ="rainy-outline";
  iconos:any[];
  public swipeUp: boolean = false;
  public swipeDown: boolean = false;
  public gesture;
  public gesture2;
  slideOpts = {
    loop: true,
  };

  // tslint:disable-next-line: max-line-length
  constructor(private statusBar: StatusBar, public platform: Platform, private animationCtrl: AnimationController, private renderer: Renderer2, private gestureCtrl: GestureController) {
      this.scrollenable = false;

      for (let i = 0; i < 20  ; i++) {
      this.items.push({
        // tslint:disable-next-line: no-use-before-declare
        name: i + ' - ' + images[rotateImg],
        imgSrc: getImgSrc(),
        avatarSrc: getImgSrc(),
        imgHeight: Math.floor(Math.random() * 50 + 150),
        // tslint:disable-next-line: no-use-before-declare
        content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
      });

      // tslint:disable-next-line: no-use-before-declare
      rotateImg++;
      // tslint:disable-next-line: no-use-before-declare
      if (rotateImg === images.length) {
        // tslint:disable-next-line: no-use-before-declare
        rotateImg = 0;
      }
    }
     


  }

  async animacion(isRegreso: boolean, click: boolean) {
    
    if (this.primeraVez) {this.primeraVez = false; return; }
    console.log("");
    let animation2: Animation;
    let animation4: Animation;
    let animation3: Animation;
    let animation5: Animation;
    let animation6: Animation;
    let animation7: Animation;
    let animation8: Animation;

    if (!isRegreso) {
      this.gesture.enable(false);
      this.gesture2.enable(false);
      this.renderer.setStyle(this.contentref2.nativeElement,"z-index",`-1`);

      setTimeout(() => {
        this.renderer.addClass(this.toolbar2.nativeElement, 'inverted-border-radius');
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
        this.moveScroll(true); this.animacionBounce(); 
        this.scrollenable = true; 
      //}
      this.estadoArriba = true;
  } else {

    this.scrollenable = false; 
    this.moveScroll(false);
    if (this.estadoArriba === false ) { return; }
    this.renderer.removeClass(this.toolbar2.nativeElement, 'inverted-border-radius');
  //  this.renderer.removeClass(this.foot.nativeElement, 'sombraFooter');
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
   .fromTo('transform' ,'translate(-2vw, -15.5vh)', 'translate(0, 0)');
 
    

    animation2.play();
    animation3.play();
    animation4.play();
 //   animation5.play();
    animation6.play();
    animation7.play();
    animation8.play();
    this.estadoArriba = false;
    
 
    
  }


  }


  async moveScroll(directionUp: boolean) {
    console.log("");
    if (directionUp) {
    const scrollto: number = (this.platform.height() - this.contentref.nativeElement.offsetHeight) + 110;

    this.content.scrollToPoint(0, scrollto, 370);
  } else {

     await this.content.scrollToTop(500);
     
     this.gesture.enable();
     this.gesture2.enable();
     this.renderer.setStyle(this.contentref2.nativeElement,"z-index",`4`);
  }

  }


 async  animacionBounce() {
console.log("");
const animation5: Animation = this.animationCtrl.create('bouceEduardo')
    .addElement(this.div2.nativeElement)
    .duration(700)
    .delay(0)
// .beforeStyles({bottom:'-16vh'})
 // .afterStyles({bottom:'-16vh'})
 //   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
 //   .fromTo('transform', 'translate3d(0, 40px, 0)', 'translate3d(0, 35px, 0)');
   .keyframes([{ offset: 0, transform: 'translate3d(0, 10px, 0)' },
 { offset: 0.7, transform: 'translate3d(0, 45px, 0)' },
 { offset: 1, transform: 'translate3d(0, 37px, 0)' }, ]);

animation5.play();
   //  animation5.destroy();
   // animation5.stop();
  //  animation5.destroy();

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
     // this.statusBar.backgroundColorByHexString('#0DFFFFFF');

 
     this.statusBar.hide();

     this.observer = new IntersectionObserver((entries) => {

        entries.forEach((entry: any) => {
          if (!entry.isIntersecting) {
         //   this.renderer.addClass(this.toolbar2.nativeElement, 'inverted-border-radius');
         //   this.renderer.addClass(this.foot.nativeElement, 'sombraFooter');
       //     this.animacion(false, false);
          } else {
         //   this.renderer.removeClass(this.toolbar2.nativeElement, 'inverted-border-radius');
         //   this.renderer.removeClass(this.foot.nativeElement, 'sombraFooter');
          //   this.renderer.setStyle(this.contentref2.nativeElement,"z-index",`-1`);
            this.animacion(true, false);
          }
        });
      }, {threshold: 0});

     this.observer.observe(this.elementsToProcess.nativeElement);

    }

    async ionSlideTouchEndSlide() {
      let index = await this.slideUp.getActiveIndex();
      console.log(index);
      //Por mientras
      index = index == 5 ? 1 : index;
      index = index == 0 ? 4 : index;
      this.header = this.headersText[index-1];
      this.nombreIcono = this.iconos[index-1];

      if(index==1)
        this.tabs = ['Noticias','Mensajes','Calendario'];
      else if(index==2)
        this.tabs = ["Foro","Recursos","Tareas"];
      else if(index==3)
        this.tabs = ["Perfil","Usuario"];
      else if(index==4)
        this.tabs = ["Código","Ayuda"];

        this.selectOption="0";
        this.pillMenu.nextSegment(await (await this.slideDown.getActiveIndex()).toString());
  
    }

    ngOnInit(): void {
      this.iconos = ['rainy-outline','watch-outline','leaf-outline','shield-outline','leaf-outline'];
      this.headersText = ['Community', 'My tasks', 'Books', 'My Account', 'Support'];
      this.tabs = ['Noticias','Calendario'];

       this.gesture = this.gestureCtrl.create({
      
        el: this.contentref.nativeElement,
        gestureName: "test-swipe",
        direction: 'y',
        threshold: 0,
        onStart: (detail) => { 
          this.renderer.setStyle(this.div2.nativeElement, "transition", `none`);
        },
        onMove: (detail) => { 

          if (detail.velocityY < -0.50) this.swipeUp = true;
          

          
          /*if(detail.deltaY>-41 && detail.velocityY>-1 && detail.velocityY<-0.30)
          {
 
            this.renderer.setStyle(this.div2.nativeElement,"transform",`translateY(${detail.deltaY}px)`);
          }*/
        },
        onEnd: (detail) => { 
           
           if (this.swipeUp == true) 
           {

           
             if (!this.scrollenable){
              
              this.animacion(false, true);
             } 
           }
           else
           {
//if (!this.scrollenable) this.animacion(true, true);
  
            this.swipeDown = true;
             //this.renderer.setStyle(this.div2.nativeElement,"transition",`0.15s ease-out`);
             //this.renderer.setStyle(this.div2.nativeElement,"transform",`translateY(0px)`);
           }
           this.swipeUp = false;
           this.swipeDown=true;
          }
      });
      
      this.gesture.enable();

      this.gesture2 = this.gestureCtrl.create({
      
        el: this.contentref2.nativeElement,
        gestureName: "test-swipe2",
        direction: 'y',
        threshold: 0,
        onStart: (detail) => { 
          this.renderer.setStyle(this.div2.nativeElement, "transition", `none`);
        },
        onMove: (detail) => { 

          if (detail.velocityY < -0.50) this.swipeUp = true;
          

          
          /*if(detail.deltaY>-41 && detail.velocityY>-1 && detail.velocityY<-0.30)
          {
 
            this.renderer.setStyle(this.div2.nativeElement,"transform",`translateY(${detail.deltaY}px)`);
          }*/
        },
        onEnd: (detail) => { 
           
           if (this.swipeUp == true) 
           {

           
             if (!this.scrollenable) this.animacion(false, true);
           }
           else
           {
//if (!this.scrollenable) this.animacion(true, true);
  
            this.swipeDown = true;
             //this.renderer.setStyle(this.div2.nativeElement,"transition",`0.15s ease-out`);
             //this.renderer.setStyle(this.div2.nativeElement,"transform",`translateY(0px)`);
           }
           this.swipeUp = false;
           this.swipeDown=true;
          }
      });
      
      this.gesture2.enable();

      
    }

    segmentChanged(event) {
      //this.slideDown.slideTo(event.detail.value);
      //this.slideUp.slideTo(event.detail.value);
    }

    async ionSlideTouchEnd(slideSelect: IonSlides,notSlideSlect: IonSlides) {
      //notSlideSlect.slideTo(await slideSelect.getActiveIndex());
      this.pillMenu.nextSegment(await (await this.slideDown.getActiveIndex()).toString());
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
