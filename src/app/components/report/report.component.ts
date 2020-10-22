import { Component, OnInit, ElementRef, Renderer2, ViewChild, Output, EventEmitter, ViewChildren, QueryList, Input } from '@angular/core';
import { IonItem, PickerController, LoadingController } from '@ionic/angular';
import { EstadisticasService } from '../../api/estadisticas.service';
import { UsuariosService } from 'src/app/api/usuarios.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  panel = "panelCerrado";
  LstEstadisticas: any[] = [];
  mesActual : string;
  meses: string[];
  loading: any;
  public user = {
    NombreCompleto : '',
    Grado  : '',
    Grupo : '',
    Escolaridad: '',
    GradoIngles: '',
    GrupoIngles: '',
    Usuario: '',
    Tipo: ''
  };
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
  items: any = [];


  constructor(private renderer: Renderer2, private apiEstadisticas: EstadisticasService, private pickerController: PickerController,
              private loadingController: LoadingController,private apiUsuarios: UsuariosService) { }

  ngOnInit() {

    this.meses = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
    
    const mesesReal = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
                  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const d = new Date();
    this.mesActual = mesesReal[d.getMonth()];

    this.apiEstadisticas.getEstadisticasAlumno('10').subscribe(data => {
    this.LstEstadisticas = data;
    console.log(this.LstEstadisticas);
  });

    const UsuarioId =this.getKeyToken('id');
    this.apiUsuarios.getUsuario(UsuarioId).subscribe(data => {
     this.user.NombreCompleto = data["NombreCompleto"];
     this.user.Grado = data["Grado"];
     this.user.Grupo = data["Grupo"];
     this.user.Escolaridad = data["Escolaridad"];
     this.user.GradoIngles = data["GradoIngles"];
     this.user.GrupoIngles = data["GrupoIngles"];
     this.user.Usuario = data["Usuario"];
     this.user.Tipo = data["Tipo"];
  });


  }

  abrirMateria(index, ele){

    this.itemsref.forEach(itemsref => {

      if (itemsref.nativeElement.id == index){
        this.aplicarEstilos(itemsref.nativeElement);
      }
      });

    this.updateAutoHeightSlider.emit();
  }

  async openPicker() {
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
              this.mesActual = value.Meses.text;
              this.cargandoAnimation('Cargando...');
              this.apiEstadisticas.getEstadisticasAlumno(value.Meses.value).subscribe(data => {
                this.LstEstadisticas = data;
                console.log(this.LstEstadisticas);
                this.loadingController.dismiss();
              });

            }
            }
        ],
        columns: 
        [{
            name: 'Meses',
            options: this.getColumnOptionsMeses()
          }
        ]
    });
    picker.columns[0].selectedIndex = this.getRealMonth();
    picker.present();

  }

  aplicarEstilos(item){
    const statusPanel = item.getAttribute("status");

    console.log(item);
    if (statusPanel == "close") {
      this.renderer.removeStyle(item, 'max-height');
   //   this.renderer.addClass(item.botonKinder.nativeElement, 'active');
      item.setAttribute('status', 'open');
      this.renderer.removeStyle(item, 'display');
    }
    else {
      this.renderer.setStyle(item, 'max-height', '0');
  //    this.renderer.removeClass(item.botonKinder.nativeElement, 'active');
      item.setAttribute('status', 'close');
      this.renderer.setStyle(item, 'display', 'none');
    }
  }


  getColumnOptionsMeses() {
    const options = [];

    this.meses.forEach((x, index) => {
      let month = index + 1;

      if (month == 1) month = 8;
      else if (month == 2) month = 9;
      else if (month == 3) month = 10;
      else if (month == 4) month = 11;
      else if (month == 5) month = 12;
      else if (month == 6) month = 1;
      else if (month == 7) month = 2;
      else if (month == 8) month = 3;
      else if (month == 9) month = 4;
      else if (month == 10) month = 5;
      else if (month == 11) month = 6;
      else if (month == 12) month = 7;

      options.push({text: x , value: month});
    });

    return options;
  }

  getRealMonth() {
    /*
    Dado que el año escolar no inicia en Enero se tiene que ajustar para llenar el picker 
    ejemplo enero en lugar de ser index 1 es 6
    */
   console.log("getRealMonth");
   const actualDate = new Date();
   let month = actualDate.getMonth() + 1;

   console.log(month);

   if (month == 1) month = 5;
    else if (month == 2) month = 6;
    else if (month == 3) month = 7;
    else if (month == 4) month = 8;
    else if (month == 5) month = 9;
    else if (month == 6) month = 10;
    else if (month == 7) month = 11;
    else if (month == 8) month = 0;
    else if (month == 9) month = 1;
    else if (month == 10) month = 2;
    else if (month == 11) month = 3;


   console.log(month);
   return month;
  }

  async cargandoAnimation(text) {
    this.loading = await this.loadingController.create({
      message: text,
      duration: 60000
    });

    await this.loading.present();
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


}
