import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { modalController } from '@ionic/core';
import { BibliotecaService } from 'src/app/api/biblioteca.service';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss'],
})
export class ModalImageComponent implements OnInit {

	@Input() datosItem: any;
	@Input() procedenciaFavoritos: boolean;
	@Input() searchActive: boolean;
	@Input() mostrarBtnAdjuntar: boolean;

	esFavoritoItem: boolean;

	afterEntrance: boolean = false;
	widthScreen: number;
	heightScreen: number;
  	constructor(private modalCtrl: ModalController, private platform: Platform, private bibliotecaService: BibliotecaService,
		public alertCtrl: AlertController) {
		console.log(this.datosItem);
	}

  	ngOnInit() {
	 	console.log(this.datosItem);
		this.platform.ready().then(()=> {
			this.widthScreen = this.platform.width();
			this.heightScreen = this.platform.height() * .75;
		});	  
 	 }
	
	ionViewWillEnter() {
		setTimeout(() => {
			this.afterEntrance = true;
		}, 300);
   	}

	onDismissModal(seleccionado: boolean) {
		let returnData = {
			seleccionado: seleccionado,
			esFavoritoItem: this.esFavoritoItem,
			datosItem:	{
				"Id": this.datosItem.Id,
				"esFavorito": this.datosItem.esFavorito === 'heart' ? true : false
			},
			procedenciaFavoritos: this.procedenciaFavoritos,
			searchActive: this.searchActive
		};
		this.modalCtrl.dismiss(returnData);
	}

	favoritosAccion(event, datos, element) {
		console.log(datos);
		let nameElement = element.el.name;
		let sendData: any[] = [];
		sendData.push({ "BibliotecaId": datos.Id });
		
		if(nameElement === 'heart-outline') {
			this.bibliotecaService.addRecursoToFavoritos(sendData).subscribe( (response) => {
				// element.el.classList.add('color-heart');
				// element.el.setAttribute('name', 'heart');
				this.datosItem.favoritoClass = 'color-heart';
				this.datosItem.esFavorito = 'heart';
				this.animate(element.el, 'heartbeat');
				this.esFavoritoItem = true;
			});
		} else {
			this.bibliotecaService.deleteRecursoToFavoritos(sendData).subscribe( async response => {
				await this.animate(element.el, 'ani-translate-izq');
				this.animate(element.el, 'ani-rubberBand').then(() => {
					// element.el.classList.remove('color-heart');
					// element.el.setAttribute('name', 'heart-outline');
					this.datosItem.favoritoClass = '';
					this.datosItem.esFavorito = 'heart-outline';
					this.esFavoritoItem = false;
				});
			});
			console.log('ended animation');
		}
   }


   async createAlertAdjuntar() {
	const alert = await this.alertCtrl.create({
		cssClass: 'alert-container',
		mode: "ios",
		message: '¿Adjuntar este archivo?',
		buttons: [
		  {
			text: 'Cancelar',
			role: 'cancel',
			cssClass: 'secondary',
			handler: (msg) => {
			  console.log('Confirm Cancel: regresar');
			}
		  }, {
			text: 'Aceptar',
			handler: (msg) => {
				let returnData = {
					"isSoloUnArchivo": true,
					"archivoData": this.datosItem
				};
				this.modalCtrl.dismiss(returnData);
			}
		  }
		]
	  });
  
	  await alert.present();
   }


      /**
	 * 
	 * @param node HTML Element - element del DOM al cual se aplicara la animacion
	 * @param animation string - nombre de la .clase-css de la animacion
	 * @returns Promise - string
	 */
	animate = (node, animation) =>
	// We create a Promise and return it
		new Promise((resolve, reject) => {
		//const node = document.querySelector(element);
		node.classList.add(animation);
		// When the animation ends, we clean the classes and resolve the Promise
		 let handleAnimationEnd = (event) => {
			event.stopPropagation();
			node.classList.remove(animation);
			resolve('Animation ended');
		}
		node.addEventListener('animationend', handleAnimationEnd, {once: true});
	});


}
