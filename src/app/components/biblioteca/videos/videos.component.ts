import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BibliotecaService } from 'src/app/api/biblioteca.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {

  @Output() backPage = new EventEmitter();
  @Output() materiaSeleccionada = new EventEmitter();
  @Input() tipoArchivo: string;
  @Input() rightEntrance: string;

  
  tipoArchivoMostrar:string;
  showDatos: boolean = false;

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

  constructor(private bibliotecaService: BibliotecaService, public loadingController: LoadingController) {

  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
	this.cargarDatos();
  }


  async cargarDatos() {
	/*const loading = await this.loadingController.create({
		message: 'Cargando...'
	});

	await loading.present();

	console.log("Tipo archivo: ", this.tipoArchivo);
    this.tipoArchivoMostrar = this.tipoArchivo;

    switch (this.tipoArchivoMostrar) {
      case 'Videos':
        this.bibliotecaService.getAllCategoriaCharactersBCS().subscribe(data => {
          for(let i = 0 ; i < this.materias.length ; i++) {
            this.materias[i].total = data.length;
          }
		  this.dismissLoadingCtrl();
        });
      break;

      case 'Imagenes':
        this.bibliotecaService.getAllEpisodesForMateriaBySerie().subscribe(data => {
          for(let i = 0 ; i < this.materias.length ; i++) {
            this.materias[i].total = data.length;
          }
		  this.dismissLoadingCtrl();
        });
      break;

      case 'Audios':
        this.bibliotecaService.getAllQuotesForMateriaBySerie().subscribe(data => {
          for(let i = 0 ; i < this.materias.length ; i++) {
            this.materias[i].total = data.length;
          }
		  this.dismissLoadingCtrl();
        });
      break;
      
      case 'Mapas':
        this.bibliotecaService.getAllDeathCountForMateriaByCharacter().subscribe(data => {
          for(let i = 0 ; i < this.materias.length ; i++) {
            this.materias[i].total = data[0].deathCount;
          }
		  this.dismissLoadingCtrl();
        });
      break;
    } */

  }

	dismissLoadingCtrl() {
		this.loadingController.dismiss();
		this.showDatos = true;
	}

  emitMateriaSeleccionada(materia: string) {
    console.log("Materia: ", materia, "Tipo Archivo: ", this.tipoArchivoMostrar);
    let sendDataSeleccionada = {
      tipoArchivo: this.tipoArchivoMostrar,
      materia: materia
    };
    this.materiaSeleccionada.emit(sendDataSeleccionada);

  }

  goBack() { 
    this.backPage.emit();
  }
}
