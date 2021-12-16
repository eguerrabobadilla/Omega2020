import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { VgApiService, VgMediaDirective } from '@videogular/ngx-videogular/core';
import { BibliotecaService } from 'src/app/api/biblioteca.service';


@Component({
  selector: 'app-modal-video',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.scss'],
})
export class ModalVideoComponent implements OnInit {

	@ViewChild(VgMediaDirective, { static: true }) media: VgMediaDirective;
	api: VgApiService;
	urlVideo:string=""
	items = [
		{
			"title":"Local video file",
			"url":"assets/video-muestra.mp4",
			"imagePreview":"assets/earth.png"
		},
	]

	afterEntrance: boolean = false;

	@Input() datosItem: any;
	@Input() procedenciaFavoritos: boolean;
	@Input() searchActive: boolean;
	@Input() mostrarBtnAdjuntar: boolean;

	esFavoritoItem: boolean;

	constructor(private modalCtrl: ModalController, public vgApiService: VgApiService, private bibliotecaService: BibliotecaService,
		public alertCtrl: AlertController) {
		
	}
 
   ngOnInit() {
		console.log(this.datosItem);
   }

   ionViewWillEnter() {
		setTimeout(() => {
			this.afterEntrance = true;
		}, 300);
   }

   playVideo(item){
    	// Play video
		this.urlVideo = item.url
		if (this.media){
			this.media.vgMedia.src = this.urlVideo;
			this.media.subscriptions.canPlay.subscribe((value) =>{
				//this.api.fsAPI.toggleFullscreen()
				this.media.play();
			})
		}
	}

	onPlayerReady(api: VgApiService){
		this.api = api;
		this.urlVideo = this.items[0].url;
	   // this.api.fsAPI.toggleFullscreen()
	}

   onDismissModal(seleccionado: boolean) {
	   	let returnData = {
		   	seleccionado: seleccionado,
		   	esFavoritoItem: this.esFavoritoItem,
			datosItem: {
				"Id": this.datosItem.Id,
				"esFavorito": this.datosItem.esFavorito === 'heart' ? true : false
			},
			procedenciaFavoritos: this.procedenciaFavoritos,
			searchActive: this.searchActive
	   	};
	   this.modalCtrl.dismiss(returnData);
   }

   favoritosAccion(event, datos, element) {
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
