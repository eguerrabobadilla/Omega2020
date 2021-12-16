import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BibliotecaService } from 'src/app/api/biblioteca.service';
import { MostrarArchivosComponent } from '../mostrar-archivos/mostrar-archivos.component';

@Component({
  selector: 'app-list-biblioteca',
  templateUrl: './list-biblioteca.component.html',
  styleUrls: ['./list-biblioteca.component.scss'],
})
export class ListBibliotecaComponent implements OnInit {

	datosBiblioteca: any[] = [];

	//Variable de prueba -- borrar later
	tiposArchivos: any[] = [ 
		{
		"nombre": "Videos",
		"total": "34",
		"icon": "videocam-outline"
		},
		{
		"nombre": "Imagenes",
		"total": "67",
		"icon": "images-outline"
		},
		{
		"nombre": "Audios",
		"total": "45",
		"icon": "mic-circle-outline"
		},
		{
		"nombre": "Mapas",
		"total": "21",
		"icon": "map-outline"
	}];

	constructor(public modalCtrl: ModalController, private bibliotecaService: BibliotecaService) { }

	ngOnInit() {
		this.bibliotecaService.getBibliotecaTotales().subscribe(datos => {
			this.datosBiblioteca = datos;
		});
	}

	/**
	 * @param tipo string - tipo de archivo que mostrara en el componente mostrar archivos
	 */
	async abrirMostrarArchivos(tipo: string) {
		const modal = await this.modalCtrl.create({
			component: MostrarArchivosComponent,
			cssClass: 'my-custom-modal-css',
			animated: true,
			backdropDismiss: true,
			mode: "ios",
			showBackdrop: true,
			componentProps: {
				datosArchivos: tipo,
				mostrarBtnAdjuntar: false
			}
		  });

		  return await modal.present();
	}

}
