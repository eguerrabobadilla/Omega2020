import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import WaveSurfer from 'wavesurfer.js';
import { BibliotecaService } from 'src/app/api/biblioteca.service';


@Component({
  selector: 'app-modal-audio',
  templateUrl: './modal-audio.component.html',
  styleUrls: ['./modal-audio.component.scss'],
})
export class ModalAudioComponent implements OnInit {

	file: MediaObject = this.media.create('../../../assets/audio-example.mp3');

	@Input() datosItem: any;
	@Input() mostrarBtnAdjuntar: boolean;
	@Input() procedenciaFavoritos: boolean;
	@Input() searchActive: boolean;

	esFavoritoItem: boolean;

	afterEntrance: boolean = false;
	audioDuration: string;
	audioCurrentTime: string;

	widthScreen: number;
	mediaTimer: any;
	ws: any;
	isPlaying: boolean;
  	constructor(public modalCtrl: ModalController, private media: Media, private platform: Platform, private bibliotecaService: BibliotecaService,
		public alertCtrl: AlertController) {
		
	}

  	ngOnInit() {
		this.platform.ready().then(()=> {
			this.widthScreen = this.platform.width();
			if(this.widthScreen % 2 !== 0) {
				this.widthScreen = this.widthScreen - 1;
			}
		});	  
	}

	ionViewWillEnter() {
		setTimeout(() => {
			this.afterEntrance = true;
		}, 300);
		
		this.ws = WaveSurfer.create({
			container: '#waveform',
			waveColor: '#D9DCFF',
			progressColor: '#4353FF',
			cursorColor: '#4353FF',
			barWidth: 3,
			barRadius: 8,
			cursorWidth: 1,
			height: 150,
			barGap: 2,
			maxCanvasWidth: this.widthScreen,
			hideScrollbar: true
		});

		this.ws.load('../../../assets/audio-example.mp3');

		this.ws.on('ready', () => {
			this.audioDuration = this.formatTimecode(this.ws.getDuration());
			this.audioCurrentTime = this.formatTimecode(this.ws.getCurrentTime());
			this.mediaTimer = setInterval(() => {
				this.audioCurrentTime = this.formatTimecode(this.ws.getCurrentTime());
			}, 1000);
		});
	}

	playAudio() {
		this.ws.play();
	}

	playPauseResume() {
		this.ws.playPause();
		this.isPlaying = this.ws.isPlaying();
	}

	repeatAudio() {
		this.ws.play([0]);
		this.isPlaying = this.ws.isPlaying();
	}

	stopAudio() {
		this.ws.stop();
		this.isPlaying = this.ws.isPlaying();
	}

	formatTimecode(seconds) {
		return new Date(seconds * 1000).toISOString().substr(14, 5);
	}

	onDismissModal(seleccionado: boolean) {
		this.ws.destroy();
		clearInterval(this.mediaTimer);
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
