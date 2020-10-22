import { Component, OnInit, ElementRef, Renderer2, ViewChild, Output, EventEmitter, ViewChildren, QueryList, Input } from '@angular/core';
import { IonItem } from '@ionic/angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  panel = "panelCerrado";
  @ViewChildren(IonItem) ArrayItems: QueryList<IonItem>;
  @ViewChildren('itemsref', {read: ElementRef}) itemsref: QueryList<ElementRef>;
  @ViewChildren('itemsrefBoton', {read: ElementRef}) itemsrefBoton: QueryList<ElementRef>;
  @ViewChild('contenedor', {read: ElementRef, static: false}) contenedor: ElementRef;
  @ViewChild('panelKinder', {read: ElementRef, static: false}) panelKinder: ElementRef;
  @ViewChild('botonKinder', {read: ElementRef, static: false}) botonKinder: ElementRef;

  @ViewChild('panelKinder1', {read: ElementRef, static: false}) panelKinder1: ElementRef;
  @ViewChild('botonKinder1', {read: ElementRef, static: false}) botonKinder1: ElementRef;

  @ViewChild('panelKinder2', {read: ElementRef, static: false}) panelKinder2: ElementRef;
  @ViewChild('botonKinder2', {read: ElementRef, static: false}) botonKinder2: ElementRef;

  @ViewChild('panelKinder3', {read: ElementRef, static: false}) panelKinder3: ElementRef;
  @ViewChild('botonKinder3', {read: ElementRef, static: false}) botonKinder3: ElementRef;

  @Output() updateAutoHeightSlider = new EventEmitter();
  items:any = [];


  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.items=[{
      id: 1,
      nombre: 'Matemáticas I',
    },
    { 
    id: 2,
    nombre: 'Química I'
    },
    { 
    id: 2,
    nombre: 'Ética Y Valores'
    },
    { 
    id: 2,
    nombre: 'Tutorías I'
    }
  ];
  }

  abrirMateria(index,ele){

    this.itemsref.forEach(itemsref => {

      if(itemsref.nativeElement.id == index){
        this.aplicarEstilos(itemsref.nativeElement);
      }
      });

      this.updateAutoHeightSlider.emit();
  }

  aplicarEstilos(item){
    const statusPanel = item.getAttribute("status");

    console.log(item);
    if(statusPanel=="close") {
      this.renderer.removeStyle(item, 'max-height');
   //   this.renderer.addClass(item.botonKinder.nativeElement, 'active');
        item.setAttribute('status','open');
       this.renderer.removeStyle(item, 'display');
    }
    else {
      this.renderer.setStyle(item, 'max-height','0');
  //    this.renderer.removeClass(item.botonKinder.nativeElement, 'active');
      item.setAttribute('status','close');
      this.renderer.setStyle(item, 'display','none');
    }
  }

  abrirMateria1(){
    console.log("abrirKinder");
    
    const statusPanel = this.panelKinder1.nativeElement.getAttribute("status");
    if(statusPanel=="close") {
      this.renderer.removeStyle(this.panelKinder1.nativeElement, 'max-height');
      this.renderer.addClass(this.botonKinder1.nativeElement, 'active');
      this.panelKinder1.nativeElement.setAttribute('status','open');
      this.renderer.removeStyle(this.panelKinder1.nativeElement, 'display');
    }
    else {
      this.renderer.setStyle(this.panelKinder1.nativeElement, 'max-height','0');
      this.renderer.removeClass(this.botonKinder1.nativeElement, 'active');
      this.panelKinder1.nativeElement.setAttribute('status','close');
      this.renderer.setStyle(this.panelKinder1.nativeElement, 'display','none');
    }

    this.updateAutoHeightSlider.emit();
  }

  
  abrirMateria2(){
    console.log("abrirKinder");
    
    const statusPanel = this.panelKinder2.nativeElement.getAttribute("status");
    if(statusPanel=="close") {
      this.renderer.removeStyle(this.panelKinder2.nativeElement, 'max-height');
      this.renderer.addClass(this.botonKinder2.nativeElement, 'active');
      this.panelKinder2.nativeElement.setAttribute('status','open');
      this.renderer.removeStyle(this.panelKinder2.nativeElement, 'display');
    }
    else {
      this.renderer.setStyle(this.panelKinder2.nativeElement, 'max-height','0');
      this.renderer.removeClass(this.botonKinder2.nativeElement, 'active');
      this.panelKinder2.nativeElement.setAttribute('status','close');
      this.renderer.setStyle(this.panelKinder2.nativeElement, 'display','none');
    }

    this.updateAutoHeightSlider.emit();
  }


  abrirMateria3(){
    console.log("abrirKinder");
    
    const statusPanel = this.panelKinder2.nativeElement.getAttribute("status");
    if(statusPanel=="close") {
      this.renderer.removeStyle(this.panelKinder3.nativeElement, 'max-height');
      this.renderer.addClass(this.botonKinder3.nativeElement, 'active');
      this.panelKinder3.nativeElement.setAttribute('status','open');
      this.renderer.removeStyle(this.panelKinder3.nativeElement, 'display');
    }
    else {
      this.renderer.setStyle(this.panelKinder3.nativeElement, 'max-height','0');
      this.renderer.removeClass(this.botonKinder3.nativeElement, 'active');
      this.panelKinder3.nativeElement.setAttribute('status','close');
      this.renderer.setStyle(this.panelKinder3.nativeElement, 'display','none');
    }

    this.updateAutoHeightSlider.emit();
  }
}
