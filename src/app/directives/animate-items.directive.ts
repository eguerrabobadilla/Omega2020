import { Directive, ContentChildren, QueryList, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { IonItem, IonCard } from '@ionic/angular';

@Directive({
  selector: '[appAnimateItems]'
})
export class AnimateItemsDirective implements AfterViewInit {

  private observer: IntersectionObserver;

  @ContentChildren(IonCard, {read: ElementRef}) items: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {
      console.log("AnimateItemsDirective");
  }

  ngAfterViewInit(){

    this.observer = new IntersectionObserver((entries) => {

      entries.forEach((entry: any) => {

        if(!entry.isIntersecting){
          this.renderer.addClass(entry.target, 'exit-enter-styles');
        } else {
          this.renderer.removeClass(entry.target, 'exit-enter-styles');
        }
      })

    }, {threshold: 0.5});

    this.items.forEach(item => {
      console.log(item);
      this.observer.observe(item.nativeElement);
    });

  }

}