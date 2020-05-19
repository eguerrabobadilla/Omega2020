import { Component, OnInit, Input, ViewChildren, ElementRef, QueryList, ViewChild, Output, EventEmitter, Renderer2 } from '@angular/core';
import { IonSegmentButton, IonSegment,  AnimationController , Animation } from '@ionic/angular';

@Component({
  selector: 'app-pill-menu',
  templateUrl: './pill-menu.component.html',
  styleUrls: ['./pill-menu.component.scss'],
})
export class PillMenuComponent implements OnInit {
  @Input() itemsMenu: any[];
  @Input() selectOption = 0;
  @Output() indicatorChanged = new EventEmitter();
  @Output() clickFab = new EventEmitter();
  @ViewChild(IonSegment,{ static: true }) Segment: IonSegment;
  @ViewChild(IonSegment,{read: ElementRef, static: true }) SegmentRef: ElementRef;
  @ViewChildren(IonSegmentButton,{ read: ElementRef }) ArraySegemntButtonHTML: QueryList<ElementRef>;
  @ViewChild('ionsegment', {read: ElementRef, static: true}) ionsegmentHTML: ElementRef;
  public indexAnterior: number =0;
  private fabVisible: boolean = true;

  constructor(private renderer: Renderer2,private animationCtrl: AnimationController) {  }

  ngOnInit() {
    //this.Segment.value ="3";
  }

  segmentChanged(event) {
   // console.log(event.detail.value);

    if(event.detail.value==undefined) {
        this.selectOption=this.indexAnterior;
        return;
    }

    let index = Number(event.detail.value);
    let element=this.ArraySegemntButtonHTML.toArray()[index].nativeElement;
    this.indexAnterior = index;
    
    /*element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });*/

    this.indicatorChanged.emit(event);
  }

  onClickFab(event) {
    //console.log(event);
    this.clickFab.emit(event);
  }

  public visibleFab(value: boolean) {
    this.fabVisible = value;
  }

  public nextSegment(index) {
    let element=this.ArraySegemntButtonHTML.toArray()[index].nativeElement;
    element.click();
  }

  public aplicarSombra() {
    this.renderer.addClass(this.ionsegmentHTML.nativeElement, 'boxshadowadd');
  }

  public quitarSombra() {
    this.renderer.removeClass(this.ionsegmentHTML.nativeElement, 'boxshadowadd');
    
  }
  public animacion() {
    
    const animation6: Animation = this.animationCtrl.create('bouceEduardo')
    .addElement(this.SegmentRef.nativeElement)
    .duration(600)
    .delay(210)
    .easing(' cubic-bezier(0,.70,.45,1)')
// .beforeStyles({bottom:'-16vh'})
 // .afterStyles({bottom:'-16vh'})
 //   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
    // .fromTo('transform', 'translate3d(0, 67vh, 0)', 'translate3d(0, 0vh, 0)');
     .keyframes([{ offset: 0, transform: 'translate3d(0, 0vh, 0)' },
     { offset: 0.6, transform: 'translate3d(0, 0.7vh, 0)' },
     { offset: 0.9, transform: 'translate3d(0, -.3vh, 0)' },
 { offset: 1, transform: 'translate3d(0, 0vh, 0)' }, ]);

 animation6.play();

  }
}
