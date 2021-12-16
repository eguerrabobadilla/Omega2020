import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, GestureController, IonInfiniteScroll, IonItemSliding, IonVirtualScroll, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
//Service Api
import { BibliotecaService } from 'src/app/api/biblioteca.service';
//Components
import { ModalImageComponent } from '../modal-image/modal-image.component';
import { ModalVideoComponent } from '../modal-video/modal-video.component';
import { ModalAudioComponent } from '../modal-audio/modal-audio.component';
import WaveSurfer from 'wavesurfer.js';
import { truncate } from 'fs';


@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
})
export class FavoritosComponent implements OnInit {
	
	
	//Variables generales
	loaderIsPresent: boolean;
	limit:number = 8;
	skip: number = 0;
	cargandoSpinner: boolean = false;
	noResults: boolean = false;
	searchActive: boolean = false;

	errorData: any[] = [];
	errorPresent: boolean = false;

	//Variables almacenamiento informacion
	datosFavoritos: any[] = [];
	checkboxes: any[] = [];
	favoritosSearch: any[] = [];

	//Audio vars
	widthScreen: number = 1;
	mediaTimer: any;
	ws: any = {};
	isPlaying: any = 'play';
	currentIndexSliding: number;

	@ViewChild(IonInfiniteScroll,{static: false}) infiniteScroll: IonInfiniteScroll;
	@ViewChild('virtualFavoritos', {static: false}) virtualFavoritos: IonVirtualScroll;
	@ViewChild('virtualFavoritosSearch', {static: false}) virtualFavoritosSearch: IonVirtualScroll;

	@ViewChildren(IonItemSliding, {read: ElementRef}) itemsSliding: QueryList<ElementRef>;

	@Output() eventEmitUpdateHeight = new EventEmitter();


  constructor(private bibliotecaService: BibliotecaService, private sanitizer: DomSanitizer, public loadingCtrl: LoadingController,
	public modalCtrl: ModalController, private platform: Platform, public alertCtrl: AlertController,
	private gestureCtrl: GestureController, public toasCtrl: ToastController, private renderer: Renderer2) { }

  async ngOnInit() {
	//await this.presentLoadingCtrl();
	this.getFirstInfoBiblioteca();
  }


  /**
   * Functions apis
   */
  suffix: number = 10;
   getDatosBibliotecaFavoritos(firstLoad: boolean, event) {
		this.bibliotecaService.getBibliotecaFavoritos(this.skip, this.limit).subscribe(
			(data) => {
			for(let i = 0 ; i < data.length ; i++) {
				this.suffix = this.suffix + 1;
				let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url(https://picsum.photos/700/8'+ this.suffix +')');
				let urlImgTrusted = this.sanitizer.bypassSecurityTrustUrl('https://picsum.photos/700/8'+ this.suffix );
				//let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url('+ data[i].img +')');
				this.datosFavoritos.push({
					Bibliotecafavoritos: data[i].Bibliotecafavoritos ,
					Categoria: data[i].Categoria,
					Descripcion: data[i].Descripcion,
					Id: data[i].Id,
					Nombre: data[i].Nombre,
					//PathRecurso: data[i].PathRecurso,
					PathRecurso: urlTrusted,
					pathImg: 'https://picsum.photos/700/8'+ this.suffix,
					Tipo: data[i].Tipo,
					// favoritoClass: data[i].esFavorito === true ? 'color-heart' : '',
					favoritoClass: 'color-heart',
					esFavorito: 'heart'
					// esFavorito: data[i].esFavorito === true ? 'heart' : 'heart-outline'
				});
				//this.checkboxes.push({'id': data[i].Id, isChecked: false});
				// this.checkBoxesAfterClearSearchBar();
			}
			
			
			if(firstLoad) {
				event.target.complete();
				this.virtualFavoritos.checkEnd();
			}

			if(!firstLoad) {
				this.skip = 8;
			}
			this.virtualFavoritos.checkEnd();
		
			this.dismissLoadingCtrl();
			console.log(this.datosFavoritos);
			this.skip+=8;

			this.eventEmitUpdateHeight.emit();
		},
		  (err) => {
			this.errorPresent = true;
			this.errorData = err;
			this.createToast(err);
			this.dismissLoadingCtrl();
		});
   }


   	doInfiniteScroll(event) {
		   console.log("do infninte");
		this.getDatosBibliotecaFavoritos(true, event);
	}

	getFirstInfoBiblioteca() {
		this.getDatosBibliotecaFavoritos(false, {});
	}

	buscarFavoritos(event) {
		let text = event.detail.value;
		this.noResults = false;

		if(text === '') {
			this.suffix = 10;
			this.skip = 0;
			this.searchActive = false;
			this.favoritosSearch = [];
			this.datosFavoritos = [];
			this.getFirstInfoBiblioteca();
		}else if(text.length <= 3) {
			return;
		} else if(text.length > 3) {
			this.bibliotecaService.getBibliotecaFavoritosSearch(text).subscribe(
				(response) => {
					this.favoritosSearch = [];
					console.log(response);
					if(response.length === 0) {
						this.noResults = true;
					}
					this.searchActive = true;
					let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url(https://picsum.photos/700/8'+ this.suffix +')');
					//let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url('+ data[i].img +')');
					for(let i = 0 ; i < response.length ; i++) {
						this.favoritosSearch.push({
							Bibliotecafavoritos: response[i].Bibliotecafavoritos ,
							Categoria: response[i].Categoria,
							Descripcion: response[i].Descripcion,
							Id: response[i].Id,
							Nombre: response[i].Nombre,
							//PathRecurso: data[i].PathRecurso,
							PathRecurso: urlTrusted,
							pathImg: 'https://picsum.photos/700/8'+ this.suffix,
							Tipo: response[i].Tipo,
							// favoritoClass: data[i].esFavorito === true ? 'color-heart' : '',
							favoritoClass: 'color-heart',
							esFavorito: 'heart'
							// esFavorito: data[i].esFavorito === true ? 'heart' : 'heart-outline'
						});
					}
					this.virtualFavoritosSearch.checkEnd();
					this.eventEmitUpdateHeight.emit();
				}
			);
		}

	}


	trackByFn(index, item) {
		return item ? item.Id : index;
	  }

  /**
   * Functions generales
   */

   async abrirItem(datosItem, index) {
	let tipoComponent: any;
	let classWrapper: string;
	if(datosItem.Tipo == 'Video') { tipoComponent = ModalVideoComponent; classWrapper = 'modal-video-viewer'; }
	if(datosItem.Tipo == 'Imagen') { tipoComponent = ModalImageComponent; classWrapper = 'modal-image-viewer'; }
	if(datosItem.Tipo == 'Audio') { tipoComponent = ModalAudioComponent; classWrapper = 'modal-video-viewer'; }
	if(datosItem.Tipo == 'Mapa') { tipoComponent = ModalImageComponent; classWrapper = 'modal-image-viewer'; }
	
	const modal = await this.modalCtrl.create({
		component: tipoComponent,
		cssClass: classWrapper,
		animated: true,
		backdropDismiss: true,
		mode: "ios",
		showBackdrop: true,
		componentProps: {
			 datosItem,
			 procedenciaFavoritos: true,
			 searchActive: this.searchActive
		}
	  });

	  /**
	   * Al cerrar modal (click seleccionar/regresar)
	   * Revisara si el dato recibido aqui es true, cambiara checkbox a true y este disparara el ionChange
	   */
	  modal.onDidDismiss().then((responseModal) => {
		console.log(responseModal);
		let dataModal = responseModal.data;

		if(dataModal.searchActive) {
			if(!dataModal.datosItem.esFavorito) {
				this.favoritosSearch = this.favoritosSearch.filter((favorito) => favorito.Id !== dataModal.datosItem.Id);
				this.virtualFavoritosSearch.checkEnd();
			}
		} else if(!dataModal.searchActive) { 
			if(!dataModal.datosItem.esFavorito) {
				this.datosFavoritos = this.datosFavoritos.filter((favorito) => favorito.Id !== dataModal.datosItem.Id);
				this.virtualFavoritos.checkEnd();
			}
		}
		// if(data.data) {
		// 	let checkbox: any = document.getElementById('item_cb_'+checkIndex);
		// 	checkbox.checked = true;
			
		// }
	  });

	  return await modal.present();
   }

   async presentLoadingCtrl() {
		const loading = await this.loadingCtrl.create({
			message: 'Cargando...',
			duration: 3000
		});

		await loading.present().then(() => {
			this.loaderIsPresent = true;
		});
	}

	async dismissLoadingCtrl() {
		if(this.loaderIsPresent === true) {
			await this.loadingCtrl.dismiss().then((msg) => {
				this.loaderIsPresent = false;
			});
		}
	}

	async createToast(datos: any) {
		const toast = await this.toasCtrl.create({
			header: `Error ${datos.status}`,
			duration: 4500,
			color: 'dark',
			mode: 'ios',
		  });
		  toast.present();
	}

	/**
	 * 
	 * @param event object - datos del DOM clickeado
	 * @param dato object - datos del archivo clickeado
	 * @param heart dom object - objecto del ion icon
	 */
	favoritosAccion(event, datos, element, index, isSearch) {
		this.cargandoSpinner = true;
		let nameElement = element.el.name;
		let sendData: any[] = [];
		sendData.push({ "BibliotecaId": datos.Id });
		
		this.bibliotecaService.deleteRecursoToFavoritos(sendData).subscribe( async response => {
			await this.animate(event.target, 'ani-translate-izq');
			this.animate(event.target, 'ani-rubberBand').then(() => {
				if(!isSearch) {
					this.datosFavoritos = this.datosFavoritos.filter(favorito => favorito.Id !== datos.Id);	
					this.virtualFavoritos.checkRange(index);
				} else {
					this.favoritosSearch = this.favoritosSearch.filter(favorito=> favorito.Id !== datos.Id);
					this.virtualFavoritosSearch.checkRange(index);
					console.log(this.favoritosSearch);
				}
				this.cargandoSpinner = false;
			});
			
			//await this.virtualFavoritos.checkEnd(); 
		});
		
		console.log('ended animation');
	}
	
	/** Audio functions */
	/**
	 * 
	 * @param datosAudio Object - datos de audio
	 * @param index number - index de container
	 * Reproduce/crea Objecto de sonido de audio (WaveSurfer), height 1, width 0 (para que no sea visible)
	 * se le asigna el index al id del conteneder correspondiente
	 */
	 playAudioOnButtonClick(datosAudio, index) {
		console.log("playAudioonbuttonCLick func");
		console.log("aaa", index);
		console.log(Object.entries(this.ws).length);
		if(Object.entries(this.ws).length == 0) {
			console.log("entro al if");
			this.currentIndexSliding = index;
			this.ws = WaveSurfer.create({
				container: '#waveform-'+index,
				waveColor: '#000',
				progressColor: '#000',
				cursorColor: '#000',
				barWidth: 0,
				barRadius: 0,
				cursorWidth: 0,
				height: 1,
				barGap: 0,
				maxCanvasWidth: 2,
				hideScrollbar: true,
				partialRender: true
			});
			
			console.log(this.ws);
			this.ws.load('../../../assets/audio-sample2.wav');
	
			this.ws.on('ready', () => {
				console.log("play");
				this.ws.play();
				this.isPlaying = this.ws.isPlaying()  == true ? 'pause' : 'play';
				this.stopAudioOnPress();
			});

			this.ws.on('error', (err) => {
				console.log({err});
			});
		} else {
			this.ws.playPause();
			this.isPlaying = this.ws.isPlaying()  == true ? 'play' : 'pause';
		}
	}

	
	/**
	 * Se llama cuando se hace un press(el cual cualquier press hace que regrese el itemSliding a su estado normal),
	 * Para asi parar el audio y destruir el objeto wavesurferxs
	 */
	 stopAudioOnPress() {
		console.log("stopAudioOnPress func");
		let itemsSlidings = this.itemsSliding.toArray();
		console.log({itemsSlidings});
		for(let i = 0 ; i < itemsSlidings.length ; i++) {
			const item = itemsSlidings[i];
			 const gesture = this.gestureCtrl.create({
				el: item.nativeElement,
				gestureName: 'press',
				onStart: evStart => {
					console.log({evStart});
					this.ws.empty();
					this.ws.unAll();
					this.ws.destroy();
					this.ws = {};
				},
				onEnd: evEnd => {
					console.log({evEnd});
					this.isPlaying = 'play';
				}
			});
			gesture.enable(true);
		}
	}

	/**
	 * 
	 * @param index number - index del container actual que reproduce el audio
	 * Si el audio se esta reproduciendo y se hace click fuera del contenedor, esto hara que para el audio y destruya el objeto
	 */
	 eventClickItemSliding(index: number) {
		console.log("eventClickSliding func")
		if(this.currentIndexSliding !== index) {
			this.ws.empty();
			this.ws.unAll();
			this.ws.destroy();
			this.ws = {};
			this.isPlaying = 'play';
		}
	}
	
	/**
	 * 
	 * @param event Object - Evento del IonDrag
	 * Al hacer swipe/drag del item, para el audio y destruye el objeto y lo inicializa en {}
	 */
	 stopAudioWhenDragged(event) {
		console.log("stopAudioWhenDraggen");
		if(event.detail.ratio  < (-0.1)) {
			if(Object.entries(this.ws).length > 0) {
				this.ws.empty();
				this.ws.unAll();
				this.ws.destroy();
				this.ws = {};
				this.isPlaying = 'play';
			}
		}
	}

	/**
	 * 
	 * @param index number - index del actual item slide
	 * Al terminar de abrir el slide asigna un index para identficar que contenedor esta actualmente reproduciendo el audio
	 */
	 assignIndex(index) {
		console.log("assign index func");
		this.currentIndexSliding = index;
	}

	
	/** others */

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
