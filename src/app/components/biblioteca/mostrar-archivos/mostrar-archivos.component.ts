import { Component, OnInit, Output, EventEmitter, Input, ViewChild, QueryList, ElementRef, ViewChildren } from '@angular/core';
import { AlertController, GestureController, IonInfiniteScroll, IonItemSliding, IonVirtualScroll, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
//import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

import { ModalImageComponent } from '../modal-image/modal-image.component';
import { ModalVideoComponent } from '../modal-video/modal-video.component';
import { ModalAudioComponent } from '../modal-audio/modal-audio.component';

import { BibliotecaService } from 'src/app/api/biblioteca.service';

//Audio library
import { Media, MediaObject } from '@ionic-native/media/ngx';
import WaveSurfer from 'wavesurfer.js';

export interface BibliotecaDatos {
	Id: any,
	appearance: any;
	better_call_saul_appearance: any;
	birthday: string;
	category: string;
	char_id: number;
	img: string;
	name:string;
	nickname:string;
	occupation: any[];
	portrayed: string;
	status: string;
};


@Component({
  selector: 'app-mostrar-archivos',
  templateUrl: './mostrar-archivos.component.html',
  styleUrls: ['./mostrar-archivos.component.scss'],
})
export class MostrarArchivosComponent implements OnInit {
  
	@Output() backPage = new EventEmitter();
	
	@Input() datosArchivos: any;
	@Input() mostrarBtnAdjuntar: boolean;

	@ViewChild(IonInfiniteScroll,{static: false}) infiniteScroll: IonInfiniteScroll;
	@ViewChild(IonVirtualScroll,{static: false}) virtualScroll: IonVirtualScroll;
	//@ViewChild('scroll', {static: false}) scroll: VirtualScrollerComponent;
	@ViewChild('virtualAudios', {static: false}) virtualAudios: IonVirtualScroll;
	@ViewChild('virtualImagenes', {static: false}) virtualImagenes: IonVirtualScroll;
	@ViewChild('virtualVideos', {static: false}) virtualVideos: IonVirtualScroll;
	@ViewChild('virtualVideosSearch', {static: false}) virtualVideosSearch: IonVirtualScroll;

	@Input('api-fadeInUp') fadeInUp: string = 'api-fadeInUp';

	@ViewChildren(IonItemSliding, {read: ElementRef}) itemsSliding: QueryList<ElementRef>;

	errorData: any[] = [];
	errorPresent: boolean = false;
	datosDeApi: any[] = [];
	datosBiblioteca: any[] = [];
	containerMostrar: string;
	limit:number = 5;
	offset:number = 0;
	skip: number = 0;
	textBuscar: string;
	showComponent: boolean = false;
	spinnerLoad: boolean = false;
	noResults: boolean = false;

	listDataAdj: any[] = [];
	favoritosList: any[] = [];
	slideFooter = false;
	cbtest: any[] = [];

	windowHeight: any;
	windowWidth: any;

	checkboxes: any[] = [];
	datosSearch: any[] = [];
	searchCheckboxes: any[] = [];
	searchActive: boolean = false;

	loaderIsPresent: boolean;

	//Audio vars
	widthScreen: number = 1;
	mediaTimer: any;
	ws: any = {};
	isPlaying: any = 'play';
	currentIndexSliding: number;

	file: MediaObject;
	constructor(private bibliotecaService: BibliotecaService, private sanitizer: DomSanitizer, public loadingController: LoadingController,
		public modalCtrl: ModalController, private platform: Platform, public alertCtrl: AlertController,
		private gestureCtrl: GestureController, public toasCtrl: ToastController) {  
	}

	async ngOnInit() {
		this.platform.ready().then(()=> {
			this.windowHeight = this.platform.height();
			this.windowWidth = this.platform.width();
		});
		await this.presentLoadingCtrl();
		this.getInfoNgOnInit();
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

	suffix: number = 10; //suffix test for img api
	carpeta: string;
	async getDatosBiblioteca(firstLoad: boolean, tipo: string, event) {
		//let url = 'limit=' + this.limit + '&offset=' + this.skip;
		if(this.datosArchivos == 'Audio') { this.carpeta = 'audios'}
		if(this.datosArchivos == 'Imagen') { this.carpeta = 'imagenes'}
		if(this.datosArchivos == 'Video') { this.carpeta = 'audios'}
		if(this.datosArchivos == 'Mapa') { this.carpeta = 'audios'}
		this.bibliotecaService.getBibliotecaDatosInfinite(tipo, this.skip, this.limit).subscribe(
			//this.bibliotecaService.getCharactersLimit(url).subscribe(
			(data) => {
			for(let i = 0 ; i < data.length ; i++) {
				//this.suffix = this.suffix + 1;
				//change
				//let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url(https://picsum.photos/700/8'+ this.suffix +')');
				let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url(https://www.alfalbs.app/ApiOmega/biblioteca/'+ this.carpeta +'/'+ data[i].PathRecurso +')');

				this.datosBiblioteca.push( {
					Bibliotecafavoritos: data[i].Bibliotecafavoritos ,
					Categoria: data[i].Categoria,
					Descripcion: data[i].Descripcion,
					Id: data[i].Id,
					Nombre: data[i].Nombre,
					PathRecurso: urlTrusted, //change
					pathImg: 'https://www.alfalbs.app/ApiOmega/biblioteca/'+ this.carpeta + '/'+ data[i].PathRecurso,

					Tipo: data[i].Tipo,
					favoritoClass: data[i].esFavorito === true ? 'color-heart' : '',
					esFavorito: data[i].esFavorito === true ? 'heart' : 'heart-outline'
				});
				//this.datosBiblioteca.push({name: data[i].name, img: urlTrusted, nickname: data[i].nickname});
				this.checkboxes.push({'Id': data[i].Id, isChecked: false});
			}
			this.checkBoxesAfterClearSearchBar();

			if(firstLoad) {
				event.target.complete();
				this.virtualVideos.checkEnd();
			}

			if(!firstLoad) {
				this.skip = 0;
			}
			
			this.dismissLoadingCtrl();
			console.log(this.datosBiblioteca);
			this.skip+=5;
			event.target.complete();
			//this.virtualVideos.checkEnd();
		},
		  (err) => {
			this.errorPresent = true;
			this.errorData = err;
			this.createToast(err);
			this.dismissLoadingCtrl();
		});
	}

	async verImagen(datosImagen: {}) {
		console.log(datosImagen);
		const modal = await this.modalCtrl.create({
			component: ModalImageComponent,
			cssClass: 'modal-image-viewer',
			animated: true,
			backdropDismiss: true,
			mode: "ios",
			showBackdrop: true,
			componentProps: {
				datosImagen
			}
		  });

		  return await modal.present();
	}

	doInfinite(event) {
		if(!this.searchActive) {
			this.getDatosBiblioteca(true, this.datosArchivos, event);
		} else {
			this.buscarEnBibliotecaInfinite();
		}
	}

	
	async presentLoadingCtrl() {
		const loading = await this.loadingController.create({
			message: 'Cargando...',
			duration: 3000
		});

		await loading.present().then(() => {
			this.loaderIsPresent = true;
		});
	}
	
	async dismissLoadingCtrl() {
		if(this.loaderIsPresent === true) {
			await this.loadingController.dismiss().then((msg) => {
				this.loaderIsPresent = false;
			});
		}
		this.showComponent = true;
	}

	//Search bar
	buscarEnBiblioteca(event: any) { 
		this.textBuscar = event.detail.value;
		this.skip = 0;

		console.log("esperando url buscar", this.textBuscar);
		console.log("tipo archivi", this.datosArchivos);

		this.noResults = false;

		if(this.textBuscar == '') {
			//this.checkBoxesAfterClearSearchBar();
			this.searchActive = false;
			this.datosSearch = [];
			this.suffix = 10; // change
			this.skip = 0;
			this.datosBiblioteca = [];
			this.checkboxes = [];
			this.getInfoNgOnInit();
			
		}else if(this.textBuscar.length <= 3) {
			return;
		}else if (this.textBuscar.length > 3) {
		 this.bibliotecaService.getBibliotecaBuscarDatos(this.datosArchivos, this.textBuscar, 0).subscribe(response => {
			 console.log("search cb - antes", this.searchCheckboxes );
			//this.bibliotecaService.getBibliotecaFavoritosSearch(event.detail.value).subscribe(response => {
				this.searchCheckboxes = [];
				console.log("search cb - antes", this.searchCheckboxes );

				this.datosSearch = [];

				if(response.length == 0) {
					this.noResults = true;
				}
				//this.datosSearch = response;
				this.searchActive = true;

				for(let i = 0 ; i < response.length ; i++) {
					this.suffix = this.suffix + 1;
					//change
					//let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url(https://picsum.photos/700/8'+ this.suffix +')');
					let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url('+ response[i].img +')');

					this.datosSearch.push( {
						Bibliotecafavoritos: response[i].Bibliotecafavoritos ,
						Categoria: response[i].Categoria,
						Descripcion: response[i].Descripcion,
						Id: response[i].Id,
						Nombre: response[i].Nombre,
						//PathRecurso: data[i].PathRecurso,
						PathRecurso: urlTrusted, //change
						pathImg: 'https://picsum.photos/700/8'+ this.suffix, //change
						Tipo: response[i].Tipo,
						favoritoClass: response[i].esFavorito === true ? 'color-heart' : '',
						esFavorito: response[i].esFavorito === true ? 'heart' : 'heart-outline'
					});

				}

				this.addSearchCheckBoxes(response);
				this.checkBoxesAfterSearch();
				this.spinnerLoad = false;
				console.log("search cb - despues", this.searchCheckboxes );
			});
			this.spinnerLoad = true;
		}
		//Se elimino el switch.
		
	}


	buscarEnBibliotecaInfinite() {
		this.bibliotecaService.getBibliotecaBuscarDatos(this.datosArchivos, this.textBuscar, this.skip).subscribe(
			(response) => {
			for(let i = 0 ; i < response.length ; i++) {
				this.suffix = this.suffix + 1;
				//change
				//let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url(https://picsum.photos/700/8'+ this.suffix +')');
				let urlTrusted = this.sanitizer.bypassSecurityTrustStyle('url('+ response[i].img +')');
				this.datosSearch.push({
					Bibliotecafavoritos: response[i].Bibliotecafavoritos ,
					Categoria: response[i].Categoria,
					Descripcion: response[i].Descripcion,
					Id: response[i].Id,
					Nombre: response[i].Nombre,
					//PathRecurso: data[i].PathRecurso,
					PathRecurso: urlTrusted, //change
					//pathImg: 'https://picsum.photos/700/8'+ this.suffix, //change
					Tipo: response[i].Tipo,
					favoritoClass: response[i].esFavorito === true ? 'color-heart' : '',
					esFavorito: response[i].esFavorito === true ? 'heart' : 'heart-outline'
				});
			}

			this.addSearchCheckBoxes(response);
			this.checkBoxesAfterSearch();
			this.spinnerLoad = false;
			this.skip =+ 8;
		});
	}
	
	/**
	 * 
	 * @param event - event del ionChange
	 * @param dato  { object } - datos del item seleccionado
	 * ionChange - add/delete dato de array ListDataAdj
	 * si lenght == 0 escondera footer ( menu )
	 */
	clickCheckBox(event, dato: any, index: number) { // <----- change ------- >
		console.log(this.checkboxes);
		if(event.detail.checked !== false) {
			let exist = false;
			for(let i = 0; i < this.listDataAdj.length ; i++) {
				if(this.listDataAdj[i].Id === dato.Id)
					exist = true;
			}
			if(!exist) {
				this.listDataAdj.push({
					"Id": dato.Id,
					"PathRecurso": dato.Nombre,
					"PathRecursoUser": dato.Nombre,
					// "path": dato.PathRecurso,
					// "categoria": dato.Categoria,
					// "Tipo": dato.Tipo,
					// "indexCheckbox": index
				});
				this.checkboxes[index].isChecked = true;
				console.log(this.checkboxes);
				this.favoritosList.push(
					{
						"BibliotecaId": dato.Id
					}
				);
			}
		} else {
			this.listDataAdj = this.listDataAdj.filter(item => item.Id !== dato.Id );
			this.favoritosList = this.favoritosList.filter(favorito => favorito.BibliotecaId !== dato.Id);
			for(let i = 0; i < this.checkboxes.length ; i++) {
				if(this.checkboxes[i].Id === dato.Id) {
					this.checkboxes[i].isChecked = false;
				}
			}
		}

		if(this.listDataAdj.length == 0) {
			this.slideFooter = true;
		}
		// console.log("checkbox event");
		// console.log(this.checkboxes);
		console.log(this.listDataAdj);
	}

	searchClickCheckBox(event, dato, index) { // <----- change ------- >
		
		if(event.detail.checked !== false) {
			let exist = false;
			for(let i = 0; i < this.listDataAdj.length ; i++) {
				if(this.listDataAdj[i].Id === dato.Id){
					exist = true;
				}
			}
			if(!exist) {
				this.listDataAdj.push({
					"Id": dato.Id,
					"PathRecurso": dato.Nombre,
					"PathRecursoUser": dato.Nombre,
					// "Id": dato.Idd,
					// "Nombre": dato.Nombre,
					// "img": dato.img,
					// "Categoria": dato.nickname,
					// "indexCheckbox": index
				});
				this.searchCheckboxes[index].isChecked = true;
			}
		}else {
			this.listDataAdj = this.listDataAdj.filter(item => item.Id !== dato.Id );
			for(let i = 0; i < this.searchCheckboxes.length ; i++) {
				if(this.searchCheckboxes[i].Id === dato.Id) {
					this.searchCheckboxes[i].isChecked = false;
				}
			}
			for(let i = 0 ; i < this.checkboxes.length ; i++) {
				if(this.checkboxes[i].Id === dato.Id) {
					this.checkboxes[i].isChecked = false;
				}
			}
		}

		console.log("despues del search check", this.listDataAdj);

		if(this.listDataAdj.length == 0) {
			this.slideFooter = true;
		}
	}
		
	/**
	 * clear checkboxes y por ende dispara ionchange
	 */
	limpiarListdata() {
		this.listDataAdj = [];
		let items: any = document.getElementsByClassName('cb_items');
		for(let i = 0 ; i < items.length ; i++) {
			items[i].checked = false;
		}
	}

	async createAlertAdjuntar() {
		const alert = await this.alertCtrl.create({
			cssClass: 'alert-container',
			mode: "ios",
			message: '¿Adjuntar los archivos seleccionados?',
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
				  this.adjuntarArchivos();
				}
			  }
			]
		  });
	  
		  await alert.present();
	}

	/**
	 * 
	 * @param datosItem { object } - datos del item seleccionado
	 * @param tipoArchivo string - tipo de archivo que se esta viendo i.e.: videos, imgs, audios etc.
	 * @param checkIndex  number - index del item seleccionado
	 * @returns abrir modal
	 */
	async abrirItem(datosItem: {}, tipoArchivo: string, checkIndex: number) {
		let tipoComponent: any;
		let classWrapper: string;
		if(tipoArchivo == 'Video') { tipoComponent = ModalVideoComponent; classWrapper = 'modal-video-viewer'; }
		if(tipoArchivo == 'Imagen') { tipoComponent = ModalImageComponent; classWrapper = 'modal-image-viewer'; }
		if(tipoArchivo == 'Audio') { tipoComponent = ModalAudioComponent; classWrapper = 'modal-video-viewer'; }
		if(tipoArchivo == 'Mapa') { tipoComponent = ModalImageComponent; classWrapper = 'modal-image-viewer'; }
		
		const modal = await this.modalCtrl.create({
			component: tipoComponent,
			cssClass: classWrapper,
			animated: true,
			backdropDismiss: true,
			mode: "ios",
			showBackdrop: true,
			componentProps: {
				 datosItem,
				 mostrarBtnAdjuntar: this.mostrarBtnAdjuntar,
				 procedenciaFavoritos: false
			}
		  });

		  /**
		   * Al cerrar modal (click seleccionar/regresar)
		   * Revisara si el dato recibido aqui es true, cambiara checkbox a true y este disparara el ionChange
		   */
		  modal.onDidDismiss().then((data) => {
			console.log(data);
			console.log({checkIndex});
			if(data.data.seleccionado) {
				let checkbox: any = document.getElementById('item_cb_'+checkIndex);
				checkbox.checked = true;
				console.log(this.listDataAdj);
			}
			if(data.data.esFavoritoItem === true) {
				this.datosBiblioteca[checkIndex].esFavorito = 'heart';
				this.datosBiblioteca[checkIndex].favoritoClass = 'color-heart';

			}else if(data.data.esFavoritoItem === false){
				this.datosBiblioteca[checkIndex].esFavorito = 'heart-outline';
				this.datosBiblioteca[checkIndex].favoritoClass = '';
			}

			// if(data.data.isSoloUnArchivo) {
			// 	this.listDataAdj = [];
			// 	this.listDataAdj = data.data.archivoData;
			// 	console.log("entro a solo archivo");
			// 	this.adjuntarArchivos();
			// }
		  });

		  modal.onDidDismiss().then( (data2) => {
			if(data2.data.isSoloUnArchivo) {
				this.listDataAdj = [];
				this.listDataAdj[0] = {
					"Id": data2.data.archivoData.Id,
					"PathRecurso": data2.data.archivoData.Nombre,
					"PathRecursoUser": data2.data.archivoData.Nombre,
				}
				
				//data2.data.archivoData;
				this.adjuntarArchivos();
			}
		  });



		  return await modal.present();		  
	}

	isChecked(idCheck) { // <----- cahnge ------- >
		let checkbox: any = this.checkboxes.map(id => {
			return id.Id;
		  });
		  return checkbox.includes(idCheck);
	}

	checkBoxesAfterClearSearchBar() { // <----- cahnge ------- >
		for(let i = 0 ; i < this.listDataAdj.length ; i++) {
			for(let j = 0 ; j < this.checkboxes.length ; j++) {
				if(this.listDataAdj[i].Id === this.checkboxes[j].Id) {
					this.checkboxes[j].isChecked = true;
				}
			}
		}
	}

	checkBoxesAfterSearch() { // <----- cahnge ------- >
		for(let i = 0 ; i < this.listDataAdj.length ; i++) {
			for(let j = 0 ; j < this.searchCheckboxes.length ; j++) {
				if(this.listDataAdj[i].Id === this.searchCheckboxes[j].Id) {
					this.searchCheckboxes[j].isChecked = true;
				}
			}
		}
	}
	
	addSearchCheckBoxes(datos) {
		this.searchActive = true;
		for(let i = 0 ; i < datos.length ; i++) {
			this.searchCheckboxes.push({"Id": datos[i].Id, isChecked: false});
		}
	}

	public trackFunction(index: number, datosBiblioteca: BibliotecaDatos): number { // <----- cahnge ------- >
		return datosBiblioteca.Id;
	}

	getInfoNgOnInit() {
		this.getDatosBiblioteca(false, this.datosArchivos, {});
	}

	onDismissModal() {
		let data = { 'banderaEdito': false};
		this.modalCtrl.dismiss(data);
	}

	formatTimecode(seconds) {
		return new Date(seconds * 1000).toISOString().substr(14, 5);
	}


	// AUDIO
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

	/**
	 * 
	 * @param index number - index del container actual que reproduce el audio
	 * Si el audio se esta reproduciendo y se hace click fuera del contenedor, esto hara que para el audio y destruya el objeto
	 */
	eventClickItemSliding(index: number) {
		if(this.currentIndexSliding !== index) {
			this.ws.empty();
			this.ws.unAll();
			this.ws.destroy();
			this.ws = {};
			this.isPlaying = 'play';
		}
	}

	/**
	 * Se llama cuando se hace un press(el cual cualquier press hace que regrese el itemSliding a su estado normal),
	 * Para asi parar el audio y destruir el objeto wavesurferxs
	 */
	stopAudioOnPress() {
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

	async favoritosAccion(event, datos, element, index) {
		let nameElement = element.el.name;
		let sendData: any[] = [];
		console.log({index});
		sendData.push({ "BibliotecaId": datos.Id });

		if(nameElement === 'heart-outline') {
			this.bibliotecaService.addRecursoToFavoritos(sendData).subscribe( (response) => {
				//event.target.classList.add('color-heart');
				//event.target.setAttribute('name', 'heart');
				if(!this.searchActive) {
					this.datosBiblioteca[index].esFavorito = 'heart';
					this.datosBiblioteca[index].favoritoClass = 'color-heart';
				} else if(this.searchActive) {
					this.datosSearch[index].esFavorito = 'heart';
					this.datosSearch[index].favoritoClass = 'color-heart';
				}
				this.animate(event.target, 'heartbeat');
			});
		} else {
			this.bibliotecaService.deleteRecursoToFavoritos(sendData).subscribe( async response => {
				await this.animate(event.target, 'ani-translate-izq');
				this.animate(event.target, 'ani-rubberBand').then(() => {
					// event.target.classList.remove('color-heart');
					// event.target.setAttribute('name', 'heart-outline');
					if(!this.searchActive) {
						this.datosBiblioteca[index].esFavorito = 'heart-outline';
						this.datosBiblioteca[index].favoritoClass = '';
					} else if(this.searchActive) {
						this.datosSearch[index].esFavorito = 'heart-outline';
						this.datosSearch[index].favoritoClass = '';
					}
				});
			});
			console.log('ended animation');
		}
	}
	

	adjuntarArchivos() {
		console.log("here", this.listDataAdj);
		setTimeout(() => {
			this.modalCtrl.dismiss(this.listDataAdj);
		}, 50);
		console.log(this.modalCtrl);
	}


	testData() { // <----- change ------- >
	 	// console.log("searchActive: ", this.searchActive);
		// console.log("searchDatos: ", this.datosSearch);
		// console.log("searchCheckBoxs: ", this.searchCheckboxes);
		// console.log(this.listDataAdj);
		// console.log("checkboxes: ", this.checkboxes);
		
		// this.bibliotecaService.getBibliotecaTotales().subscribe(data => {
		// 	console.log({data});
		// });
		
		// this.bibliotecaService.getBibliotecaDatosTipo('').subscribe(data => {
		// 	console.log({data});
		// });

		//console.log(this.favoritosList);
 
	}

	classFavorito: string;
	nameFavorito: string = 'heart-outline';
	isFavorito: boolean = false;
	classFavoriteSingle: string = 'heart-outline';
	isFavoritoSingle: boolean = false;
	async addFavTest() {
		let elementDiv = document.getElementById('div-heart');
		let elementIcon = document.getElementById('heart-fav');

		console.log(this.favoritosList);

		elementDiv.classList.remove('ion-hide');
		this.bibliotecaService.addRecursoToFavoritos(this.favoritosList).subscribe( async (response) => {
			console.log(response);
			// event.target.classList.add('color-heart');
			// event.target.setAttribute('name', 'heart');
			// this.animate(event.target, 'heartbeat');
			await this.animate(elementDiv, 'heartbeat');

			for(let i = 0 ; i < this.favoritosList.length ; i++) {
				for(let j = 0 ; j < this.datosBiblioteca.length ; j++) {
					if(this.favoritosList[i].BibliotecaId === this.datosBiblioteca[j].Id) {
						this.datosBiblioteca[j].esFavorito = 'heart';
						this.datosBiblioteca[j].favoritoClass = 'color-heart';
					}
				}
			}

			await this.animate(elementDiv, 'ani-fadeOut').then((msg) => {
				elementDiv.classList.add('ion-hide');
			});

		}, async (err) => {
			console.log({err});
			elementDiv.classList.add('ion-hide');
		});

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
