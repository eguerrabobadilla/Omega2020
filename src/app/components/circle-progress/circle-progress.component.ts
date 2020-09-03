import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss'],
})
export class CircleProgressComponent implements OnInit {
  @ViewChild('circleProgress', {read: ElementRef, static: false}) circleProgress: ElementRef;
  @ViewChild('counter', {read: ElementRef, static: false}) counter: ElementRef;
  @Input() item: any;

  constructor(private renderer: Renderer2) { 
    
  }

  ngOnInit() {

  }

  ngAfterViewInit (){
    this.renderer.setStyle(this.circleProgress.nativeElement,'stroke-dashoffset',157.08);
  }

  openBook() {
    console.log("openBook circle");
  }

  restartProgress() {
    this.renderer.setStyle(this.circleProgress.nativeElement,'stroke-dashoffset',157.08);
  }

  progress(val) {
    //console.log(val);
    if (isNaN(val)) {
        val = 100; 
    } else {
        const r = this.circleProgress.nativeElement.getAttribute('r');
        const c = Math.PI*(r*2);

        if (val < 0) { val = 0;}
        if (val > 100) { val = 100;}
        
        const pct = ((100-val)/100)*c;

        this.renderer.setStyle(this.circleProgress.nativeElement,'stroke-dashoffset',pct);
        this.renderer.setAttribute(this.counter.nativeElement, 'data-pct', val);

        if(val >= 100)
          this.renderer.setStyle(this.circleProgress.nativeElement,'display','none');
    }
  }
}
