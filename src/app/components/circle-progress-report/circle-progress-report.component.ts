import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-circle-progress-report',
  templateUrl: './circle-progress-report.component.html',
  styleUrls: ['./circle-progress-report.component.scss'],
})
export class CircleProgressReportComponent implements OnInit {
  @ViewChild('circleProgress', {read: ElementRef, static: false}) circleProgress: ElementRef;
  @ViewChild('counter', {read: ElementRef, static: false}) counter: ElementRef;
  @Input() item: any;
  @Input() porcentaje: any;
  colorStroke: string;

  constructor(private renderer: Renderer2) { 
   
  }

  ngOnInit() {
    
  }

  ngAfterViewInit () {
  //  console.log(this.porcentaje);
    this.renderer.setStyle(this.circleProgress.nativeElement,'stroke-dashoffset',62.83);
    setTimeout(() => {
      this.progress(this.porcentaje);
    }, 500);
  }

  openBook() {
    console.log("openBook circle");
  }

  restartProgress() {
    this.renderer.setStyle(this.circleProgress.nativeElement,'stroke-dashoffset',62.83);
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
      //  console.log(pct);

        if(val > 0 && val <= 33) {
           this.colorStroke = 'red';
        } else if (val > 33 && val <= 66) {
          this.colorStroke = '#ffcc03';
        } else if (val > 66 && val <= 100) {
          this.colorStroke = 'green';
        }

        this.renderer.setStyle(this.circleProgress.nativeElement,'stroke-dashoffset',pct);
        this.renderer.setAttribute(this.counter.nativeElement, 'data-pct', val);
        this.renderer.setStyle(this.circleProgress.nativeElement,'stroke',this.colorStroke);

        /*if(val >= 100)
          this.renderer.setStyle(this.circleProgress.nativeElement,'display','none');*/
    }
  }

}
