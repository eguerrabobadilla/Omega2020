import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';

//Components
import { MostrarArchivosComponent } from 'src/app/components/biblioteca/mostrar-archivos/mostrar-archivos.component';
//Services
import { BibliotecaService } from '../../api/biblioteca.service';
import { componentFactoryName } from '@angular/compiler';
 
@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.page.html',
  styleUrls: ['./biblioteca.page.scss'],
})
export class BibliotecaPage implements OnInit {
  
  titulo: string;
  mostrarComponent: boolean;
  //Ajustes
  slideOptsdos = {
    autoHeight: true
  };
  
  showSpinner: boolean = true;
  
  showCollapse: boolean[] = [false, false, false, false];
  classArrowDown: string = 'ani-fadeOut';
  classArrowUp: string = 'ani-fadeIn';

  @ViewChild('processContainer', { read: ViewContainerRef,static: false }) container; //Container Alumnos

  public tiposArchivos: any[] = [ 
    {
      "tipoArchivo": "Videos",
      "total": "",
      "icon": "videocam-outline",
    },
    {
      "tipoArchivo": "Imagenes",
      "total": "",
      "icon": "image-outline"
    },
    {
      "tipoArchivo": "Audios",
      "total": "",
      "icon": "radio-outline"
    },
    {
      "tipoArchivo": "Mapas",
      "total": "",
      "icon": "document-text-outline"
    }
  ];
  
  //Variable de prueba
  materias: any[] = [ 
    {
      "nombre": "Ciencias",
      "total": "",
      "icon": "color-wand-outline"
    },
    {
      "nombre": "Español",
      "total": "",
      "icon": "book-outline"
    },
    {
      "nombre": "Matemáticas",
      "total": "",
      "icon": "shapes-outline"
    },
    {
      "nombre": "Biología",
      "total": "",
      "icon": "paw-outline"
    },
    {
      "nombre": "Física",
      "total": "",
      "icon": "thermometer-outline"
    },
    {
      "nombre": "Química",
      "total": "",
      "icon": "water-outline"
    }
  ];

  	constructor(private modalCtrl: ModalController, private apiBiblioteca: BibliotecaService, private resolver: ComponentFactoryResolver) { 
		console.log("spinner", this.showSpinner)
  	}

  ionViewWillEnter() {
    this.titulo = "Biblioteca";
  }

  showMaterias(tipoArchivo: string) {
    this.openComponent(tipoArchivo);
  }

  public openComponent(tipoArchivo: string) {
    this.mostrarComponent = false;
    //let videosComponent = this.createComponent(VideosComponent);
    //this.subscribeToVideos(videosComponent, tipoArchivo, 'left-entrance');
    
  }

  public subscribeToVideos(component: any, tipoArchivo: string, typeEntrance: string) {
    //Enviar tipo de archivo al componente materias
    component.instance.tipoArchivo = tipoArchivo;
    component.instance.tipoEntrada = typeEntrance;

    component.instance.backPage.subscribe(() => {
      component.destroy(); 
      this.mostrarComponent = true;
    });

    component.instance.materiaSeleccionada.subscribe(dataFromMateria => {
      //data received de componente materias
      console.log(dataFromMateria)
      component.destroy();
      let mostrarArchivosComponent = this.createComponent(MostrarArchivosComponent);
      this.susbscribeToMostrarArchivos(mostrarArchivosComponent, dataFromMateria);
    });
  }

  public susbscribeToMostrarArchivos(component: any, datos: any) {
    component.instance.datosArchivos = datos;
    console.log("component Mostrar Archivos",datos)

    component.instance.backPage.subscribe(() => {
      component.destroy();
      //let videosComponent = this.createComponent(VideosComponent);
      //this.subscribeToVideos(videosComponent, datos.tipoArchivo, 'right-entrance');
    });
  }

  //function crear component
  public createComponent(component: any){
    const factory = this.resolver.resolveComponentFactory(component);
    let componentRef = this.container.createComponent(factory);
    componentRef.location.nativeElement.style = `width:100%`;

    return componentRef;
  }

  closeModal() {
    this.modalCtrl.dismiss({
      
    });
  }

  	ngOnInit() {
     //Ejemplo videos
	 this.mostrarComponent = true;

	/*  this.apiBiblioteca.getAllEpisodes().subscribe(episodes => {
	   this.tiposArchivos[0].total = episodes.length
	 });
	 //Ejemplo imgs
	 this.apiBiblioteca.getAllCharacters().subscribe(characters => {
	   this.tiposArchivos[1].total = characters.length
	 });
 
	  //Ejemplo audios
	  this.apiBiblioteca.getAllQuotes().subscribe(quotes => {
	   this.tiposArchivos[2].total = quotes.length
	 });
	 
	 //Ejemplo documentos
	this.apiBiblioteca.getAllDeathCount().subscribe(deathCount => {
	   this.tiposArchivos[3].total = deathCount[0].deathCount;
	 });
 */
	 

  }

  openCollapse(index: number) {
	  this.showCollapse[index] = !this.showCollapse[index];

	  for(let i = 0; i < this.showCollapse.length ; i++) {
		  if(index == i) continue;
		  this.showCollapse[i] = false;
	  }
  }

  async ngAfterViewInit (){
    console.log("ngAfterViewInit");
    setTimeout(() => {
      this.showSpinner = false;
    }, 700);
  }

}
