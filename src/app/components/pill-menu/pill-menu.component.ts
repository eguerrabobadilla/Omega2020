import { Component, OnInit, Input, ViewChildren, ElementRef, QueryList, ViewChild, Output, EventEmitter, Renderer2 } from '@angular/core';
import { IonSegmentButton, IonSegment, } from '@ionic/angular';

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
  @ViewChildren(IonSegmentButton,{ read: ElementRef }) ArraySegemntButtonHTML: QueryList<ElementRef>;
  @ViewChild('ionsegment', {read: ElementRef, static: true}) ionsegmentHTML: ElementRef;
  public indexAnterior: number =0;

  constructor(private renderer: Renderer2) {  }

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
}
