import { Component, OnInit, HostListener, ElementRef, ViewChild, Output,EventEmitter } from '@angular/core';
import { PickerController, Platform, ModalController, LoadingController, AlertController, GestureController, IonSlide, IonSlides, IonInfiniteScroll, IonVirtualScroll, AnimationController } from '@ionic/angular';
import { RecursosService } from '../../api/recursos.service';
import { Plugins } from '@capacitor/core';
import { File,FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { apiBase } from 'src/app/api/apiBase';
import { NewResourcePage } from 'src/app/new-resource/new-resource.page';
import { ListBibliotecaComponent } from '../biblioteca/list-biblioteca/list-biblioteca.component';
import { CommentStmt } from '@angular/compiler';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { element } from 'protractor';


@Component({
  selector: 'app-list-resource',
  templateUrl: './list-resource.component.html',
  styleUrls: ['./list-resource.component.scss'],
})
export class ListResourceComponent implements OnInit {

  rotateImg = 0;
  public gesture2;
  @Output() changeIonChip = new EventEmitter();
  @ViewChild('scrollh', {read: ElementRef, static: true}) scrollh: ElementRef;
  @ViewChild('slideDown', {static: false}) slideDown: IonSlides;
  items: any[] = [];
  meses: string[];
  mesActual: string = 'Mayo';
  LstRecursos: any[] = [];
  materiaId =0;
  contadorInfinieScroll = 0;
  esConferencia=true;
  esBiblioteca: boolean = false;
  esFavoritos: boolean = false;
  currentChip: number = 3;
  nextChip: number;
  loading: any;
  evento:any;
  cargarConFiltro = false;
  currentChipSlide: number;
  @Output() updateAutoHeightSlider = new EventEmitter();
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;
  @ViewChild('slideChips', { static: false }) slideChips: IonSlides; // <----

  
  /**
   * @param {node} element - element al que se le asiganara la animacion (class)
   * @param {animation} string - class de la animacion
   * @return Promise 
   */
  addAnimation = (node, animation) =>
	// We create a Promise and return it
		new Promise((resolve, reject) => {
		//const node = document.querySelector(element);

		node.classList.add(animation);

		// When the animation ends, we clean the classes and resolve the Promise
		function handleAnimationEnd(event) {
			event.stopPropagation();
			node.classList.remove(animation);
			resolve('Animation ended');
		}

		node.addEventListener('animationend', handleAnimationEnd, {once: true});
	});

	slideChipsOptions = {
		slidesPerView: 'auto', 
		zoom: false, 
		grabCursor: true, 
		spaceBetween: 0, 
		longSwipes: true, 
		longSwipesMs: 100 
	};
	mostrarCerrarChips: boolean = false;

  outline = [{id:'Foto', selected: true, animation: ''},
             {id:'Video', selected: true, animation: ''},
             {id:'Enlace', selected: true, animation: ''},
             {id:'Zoom', selected: false, animation: ''},
             {id:'Todos', selected: true, animation: ''},
             {id:'Biblioteca', selected: true, animation: ''},
             {id:'Favoritos', selected: true, animation: ''},
			];
  slideOptsdos = {

              passiveListeners : false
            };
	
			@ViewChild('componentListBiblioteca', {read: ElementRef, static: false}) componentListBiblioteca: ElementRef;

  constructor(private pickerController: PickerController, private apiRecursos: RecursosService, private transfer: FileTransfer,
              private file: File, private platform: Platform,private fileOpener: FileOpener,private api: apiBase,
              private modalCrl: ModalController,public loadingController: LoadingController, private alertCtrl: AlertController,
              private inAppBrowser: InAppBrowser,private gestureCtrl: GestureController, private animationCtrl: AnimationController) {
  }

ngOnInit() {
    //console.log("jose")
    this.meses = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
                  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];

    const mesesReal = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
                  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const d = new Date();
    this.mesActual= mesesReal[d.getMonth()];

  /*  this.apiRecursos.getByMonthTipo(this.mesActual,'tipo=Zoom').subscribe(data => {
      //console.log(data);
      this.LstRecursos = data;
    });*/
    this.apiRecursos.getByMonthTipoInfinite(this.mesActual, 'Zoom', this.contadorInfinieScroll, 10).subscribe(data => {
      console.log('getInfinite');
      console.log(data);
      this.LstRecursos = data;
      this.contadorInfinieScroll += 10;
      
    });
  //  this.activarEventoTouch();
    this.slideDown.lockSwipes(true);
  }

  emitUpdateHeight() {
	  this.updateAutoHeightSlider.emit();
  }

  activarEventoTouch(){
      

    this.gesture2 = this.gestureCtrl.create({
        el: this.scrollh.nativeElement,
        gestureName: 'stop',
        direction: 'x',
        disableScroll:false,
        gesturePriority:100,
        passive:true,
        threshold: 0.5,
        onStart: (detail) => {
          

          //this.gesture.disabled();
          //  this.renderer.setStyle(this.div2.nativeElement, 'transition', `none`);
        },
        onMove: (detail) => {
         console.log("test")
          //  this.gesture.disabled();
          },
      });
    this.gesture2.enable();
}
  async cargandoAnimation() {
    this.loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await this.loading.present();
  }

  public async cargar(materiaId) {
    console.log("materiaId",materiaId);
    
    this.materiaId = materiaId;
    console.log(this.materiaId);
    this.contadorInfinieScroll = 0;
    setTimeout(() => {
      this.updateAutoHeightSlider.emit();
     }, 300);
    //0=todas 1=Filtrado por materia

    if(this.esConferencia){
        this.infiniteScroll.disabled=false;
        const tipoValidate = this.esConferencia==true ? 'Zoom' : 'Todos';
        
        this.selected(tipoValidate, materiaId);

    }
    else{
      console.log("cargar sin infinite")
      this.selectedSinInfinite(materiaId);
    }
  }

  getApiRecursosZoomSinFiltro(event) {
    console.log('cargarSinfiltro');
    const tipoRecurso = this.esConferencia == true ? 'Zoom' : 'tipo=Foto&tipo=Video&tipo=Enlace&tipo=Documento&tipo=Texto';
    this.apiRecursos.getByMonthTipoInfinite(this.mesActual, tipoRecurso, this.contadorInfinieScroll, 10).subscribe(data => {
      console.log('getInfinite');
      console.log(data);
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          console.log('dentro');
          this.LstRecursos.push(data[i]);
        }
         this.infiniteScroll.complete();
         event.target.complete();
        this.contadorInfinieScroll += 10;
        setTimeout(() => {
            this.updateAutoHeightSlider.emit();
        }, 300);
           if(this.esConferencia) this.virtualScroll.checkEnd();
      } else {
        console.log('fin scroll');
        console.log( event.target)
       event.target.disabled = true;
        this.infiniteScroll.disabled= true;
        this.evento=event.target;
        setTimeout(() => {
           this.updateAutoHeightSlider.emit();
          }, 300);
      }
      this.cargarConFiltro=false;
    });

      
    
  }

  
  getApiRecursosZoomConFiltro(event) {
    console.log('cargarSinfiltro');
    const tipoRecurso = this.esConferencia == true ? 'Zoom' : 'tipo=Foto&tipo=Video&tipo=Enlace&tipo=Documento&tipo=Texto';
    this.apiRecursos.getByMonthTipoInfiniteMateria(this.mesActual, tipoRecurso, this.contadorInfinieScroll, 10, this.materiaId).subscribe(data => {
      console.log('getInfinite');
      console.log(data);
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          console.log('dentro');
          this.LstRecursos.push(data[i]);
        }

        event.target.complete();
        this.contadorInfinieScroll += 10;
        setTimeout(() => {
            this.updateAutoHeightSlider.emit();
        }, 300);
        if(this.esConferencia) this.virtualScroll.checkEnd();
      } else {
        console.log('fin scroll');
        event.target.disabled = true;
        setTimeout(() => {
           this.updateAutoHeightSlider.emit();
          }, 300);
      }
      
    });

      
    
  }
  async selectedSinInfinite(materiaId){
    await this.cargandoAnimation();
    console.log("materia", materiaId)
    if(materiaId==0){
      this.apiRecursos.getByMonthTipo(this.mesActual,'tipo=Foto&tipo=Video&tipo=Enlace&tipo=Documento&tipo=Texto').subscribe(data => {
        this.LstRecursos = data;
        /* this.outline.find(x => x.id === 'Zoom').selected = true;
        this.outline.find(x => x.id === 'Todos').selected = false; */
		this.changeOutLineChips('Todos');
        this.esConferencia = false;
		this.esBiblioteca = false;
		this.esFavoritos = false;
        this.loadingController.dismiss();  
        
        this.changeIonChip.emit('Archivo');
        setTimeout(() => {
          this.updateAutoHeightSlider.emit();
        }, 300);
      });
    }
    else{
      this.apiRecursos.getByMonthTipoMateria(this.mesActual,'tipo=Foto&tipo=Video&tipo=Enlace&tipo=Documento&tipo=Texto',materiaId).subscribe(data => {
        this.LstRecursos = data;
        /* this.outline.find(x => x.id === 'Zoom').selected = true;
        this.outline.find(x => x.id === 'Todos').selected = false; */
		this.changeOutLineChips('Todos');
        this.esConferencia = false;
		this.esBiblioteca = false;
		this.esFavoritos = false;
        this.loadingController.dismiss();  
        this.changeIonChip.emit('Archivo');
        setTimeout(() => {
          this.updateAutoHeightSlider.emit();
        }, 300);
      });
    }

	this.mostrarCerrarChips == false ? this.hideChips('Todos', 2) : this.showAllChips(2);
	this.changeAnimationContainers(4, "Todos");
	//this.currentChip = this.getIndexOutLineChips('Todos');
  }


  loadData(event) {
    console.log("loadData");
    console.log(this.cargarConFiltro);
    if (this.cargarConFiltro) {
      this.getApiRecursosZoomConFiltro(event);
     
    } 
     else {
      this.getApiRecursosZoomSinFiltro(event);
     } 
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
            handler: (value: any) => {
              this.mesActual = value.Meses.value;
              this.contadorInfinieScroll = 0;
              
              if(this.esConferencia) {
                this.infiniteScroll.disabled=false;
                this.selected('Zoom',0);
              } else {
                this.selectedSinInfinite(0)
              }

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

  async selected(tipo, materiaId){
    this.contadorInfinieScroll = 0;
 //   this.outline.find(x => x.id === tipo).selected = !this.outline.find(x => x.id === tipo).selected ;
    await this.cargandoAnimation();
    const tipoRecurso = tipo == 'Zoom' ? 'Zoom' : 'tipo=Foto&tipo=Video&tipo=Enlace&tipo=Documento&tipo=Texto';
    if(materiaId != 0){

      this.apiRecursos.getByMonthTipoInfiniteMateria(this.mesActual, tipoRecurso, this.contadorInfinieScroll, 10, materiaId ).subscribe(data => {
        console.log('getInfinite');
        console.log(data);
        this.LstRecursos = data;
        this.contadorInfinieScroll += 10;

         if(tipo=='Zoom'){
          /* this.outline.find(x => x.id === 'Zoom').selected = false;
          this.outline.find(x => x.id === 'Todos').selected = true; */
		  this.changeOutLineChips('Zoom');
          this.esConferencia = true;
		  this.esBiblioteca = false;
		  this.esFavoritos = false;
          this.changeIonChip.emit('Clase Virtual');
         }
         else{
          /* this.outline.find(x => x.id === 'Zoom').selected = true;
          this.outline.find(x => x.id === 'Todos').selected = false; */
		  this.changeOutLineChips('Zoom');
          this.esConferencia = false;
		  this.esBiblioteca = false;
		  this.esFavoritos = false;
          this.changeIonChip.emit('Archivo');
         }

        
        
        this.loadingController.dismiss();
        this.cargarConFiltro=true;
      });
    }
    else{
      this.apiRecursos.getByMonthTipoInfinite(this.mesActual, tipoRecurso, this.contadorInfinieScroll, 10 ).subscribe(data => {
        console.log('getInfinite', tipoRecurso);
        console.log(data);
        this.LstRecursos = data;
        this.contadorInfinieScroll += 10;
        if(tipo=='Zoom'){
          /* this.outline.find(x => x.id === 'Zoom').selected = false;
          this.outline.find(x => x.id === 'Todos').selected = true; */
		  this.changeOutLineChips('Zoom');
          this.esConferencia = true;
		  this.esBiblioteca = false;
		  this.esFavoritos = false;
          this.changeIonChip.emit('Clase Virtual');
         }
         else{
          /* this.outline.find(x => x.id === 'Zoom').selected = true;
          this.outline.find(x => x.id === 'Todos').selected = false; */
		  this.changeOutLineChips('Zoom');
          this.esConferencia = false;
		  this.esBiblioteca = false;
		  this.esFavoritos = false;
          this.changeIonChip.emit('Archivo');
         }

        this.loadingController.dismiss();
 
        this.cargarConFiltro=false;
      });

    }

	this.mostrarCerrarChips == false ? this.hideChips(tipo, 1) : this.showAllChips(1);
	this.changeAnimationContainers(3, tipo);
	//this.currentChip = this.getIndexOutLineChips(tipo);
  }
  stop(){
    console.log("stop")
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

   if(month==1) month= 5;
    else if(month==2) month= 6;
    else if(month==3) month= 7;
    else if(month==4) month= 8;
    else if(month==5) month= 9;
    else if(month==6) month= 10;
    else if(month==7) month= 11;
    else if(month==8) month= 0;
    else if(month==9) month= 1;
    else if(month==10) month= 2;
    else if(month==11) month= 3;


   console.log(month);
   return month;
  }

  getColumnOptionsMeses() {
    const options = [];

    this.meses.forEach(x => {
      options.push({text: x , value: x});
    });

    return options;
  }

  async openFile(item) {
    this.loading =await this.loadingController.create({
      //cssClass: 'my-custom-class',
      message: 'Cargando...',
      duration: 120000
    });

    this.loading.present();
    
    console.log(item);
    const { Browser } = Plugins;

    if (this.platform.is('cordova')) {
      this.download(`${this.api.url}/resources/${item.PathRecurso}`,item.PathRecursoUser);
    } else {
      await Browser.open({ url: `${this.api.url}/resources/${item.PathRecurso}` });
      this.loadingController.dismiss();
    }
  }

  async openFileBiblioteca(archivo) {
	  this.loading = await this.loadingController.create({
		  message: 'Cargando...',
		  duration: 10000
	  });

	  this.loading.present();

	  console.log(archivo);
	  
	  const { Browser } = Plugins;

	  if(this.platform.is('cordova')) {
		  this.download(`${this.api.url}/resources/${archivo.PathRecurso}`,archivo.PathRecursoUser)
	  } else {
		await Browser.open({ url: `${this.api.url}/resources/${archivo.PathRecurso}` });
		this.loadingController.dismiss();
	  }
  }

  urlify(text) {
     console.log(text);
     const urlRegex = /(https?:\/\/[^\s]+)/g;
     return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }

  download(url,NameFile) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const extension = url.split('.').pop();
    const pathDownload = this.platform.is("android") ? this.file.dataDirectory  :  this.file.dataDirectory;
    //const pathDownload = this.platform.is("android") ? this.file.externalDataDirectory :  this.file.documentsDirectory;
    //const pathDownload = this.platform.is("android") ? this.file.externalRootDirectory + "download/" :  this.file.documentsDirectory;

    fileTransfer.download(url, pathDownload + NameFile).then((entry) => {
        console.log('download complete: ' + entry.toURL());

        let files = entry as FileEntry;
        files.file(success =>{
            //success.name;

            this.fileOpener.open(pathDownload + NameFile , success.type)
            .then(() => { console.log('File is opened'); this.loadingController.dismiss(); })
            .catch(e => { console.log('Error opening file', e); this.loadingController.dismiss(); });
        });
    }, (error) => {
      // handle error
      console.log(error);
      this.loadingController.dismiss();
      alert(error.exception);
    });

  }

  public async edit(event,item){
    event.stopPropagation();

    const modal = await this.modalCrl.create({
      component: NewResourcePage,
      // cssClass: 'my-custom-modal-css',
      cssClass: 'my-custom-modal-css-capturas',
      showBackdrop: false,
      componentProps: {item},
      mode: 'ios',
      backdropDismiss: true
    });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
        if(data.data.banderaEdito==true)
        {
          console.log(this.materiaId);
          this.cargar(this.materiaId);
        }
    });
  }

  public async eliminar(event,item) {
    event.stopPropagation();
    //console.log(item);

    const alertTerminado = await this.alertCtrl.create({
      header: 'ELIMINAR',
      message: '¿Está seguro de ELIMINAR el recurso?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No', handler: () =>  {
            return;
          }
        },
        {
          text: 'Si', handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando...'
            });
        
            await loading.present();
        
            await this.apiRecursos.delete(item.Id).toPromise();

            this.LstRecursos = this.LstRecursos.filter(obj => obj !== item);

            await this.loadingController.dismiss();

            //this.alertCtrl.dismiss();
          }
        }
      ]
    });

    alertTerminado.present();
  }

  public permisoEditar() {
    const jwt_temp = localStorage.getItem('USER_INFO_TEMP');
    if(jwt_temp != null)
    {
        return false;
    }
    
    if(this.getKeyToken('tipo')=='Profesor')
      return true;
    else
      return false;
  }

  public datosClase(item){
     let html='';
     if(item.GrupoIngles=="NO")
      html = `<br><br><b>Grupo:</b> ${item.Grado} ${item.Grupo} ${item.Escolaridad }<br><b>Materia:</b> ${item.Materia.Nombre }`;
    else
      html = `<br><br><b>Grupo:</b> Level ${item.Grado} ${item.Grupo} ${item.Escolaridad }<br><b>Materia:</b> ${item.Materia.Nombre }`;
     return html;
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

  @HostListener("click", ["$event"])
  onClick(e) {
    if (e.target.classList.contains("link")) {
      e.preventDefault();
      console.log(e);
      
      //Es un link de videocoferencia
      if (((e.target.getAttribute("href").toLowerCase().includes('https://') || e.target.getAttribute("href").toLowerCase().includes('http://')) && e.target.getAttribute("href").toLowerCase().includes('zoom.us')))
      {
        const recursoId = e.target.getAttribute("hreflang");
        this.apiRecursos.asistenciaConferencia(recursoId).subscribe(data => {
            if (this.platform.is('cordova')) {
              this.inAppBrowser.create(e.target.getAttribute("href"), '_system');
            } else {
              const { Browser } = Plugins;
    
              Browser.open({ url: e.target.getAttribute("href") });
            }
        });
      }
      else {

        if (this.platform.is('cordova')) {
          this.inAppBrowser.create(e.target.getAttribute("href"), '_system');
        } else {
          const { Browser } = Plugins;

          Browser.open({ url: e.target.getAttribute("href") });
        }

      }
    }
  }

  	/**
	 * 
	 * @param tipo string -  el tipo (categoria) que pertenece el chip
	 * @param indexChip number - index del chip al que pertenece (slide)
	 */
	abrirBiblioteca(tipo: string, indexChip: number) {
		this.mostrarCerrarChips == false ? this.hideChips(tipo, indexChip) : this.showAllChips(3);
		this.changeAnimationContainers(5, tipo);

	  	this.esConferencia = false;
		this.esBiblioteca = true;
		this.esFavoritos = false;
		//this.outline[outlineIndex].selected = true;
		this.changeOutLineChips(tipo);
		
		setTimeout(() => {
			this.updateAutoHeightSlider.emit();
		}, 200);
  	}
	/**
	 * 
	 * @param tipo string -  el tipo (categoria) que pertenece el chip
	 * @param indexChip number - index del chip al que pertenece (slide)
	 */
	abrirFavoritos(tipo: string, indexChip: number) {
		this.mostrarCerrarChips == false ? this.hideChips(tipo, indexChip) : this.showAllChips(4);
		this.changeAnimationContainers(6, tipo);

		this.esConferencia = false;
		this.esBiblioteca = false;
		this.esFavoritos = true;
		this.changeOutLineChips(tipo);

		setTimeout(() => {
			this.updateAutoHeightSlider.emit();
		}, 200);
	}

	/**
	 * 
	 * @param tipo string - el tipo (categoria) que pertenece el chip
	 * Cambia el outline del chip dependiendo el tipo que se selecciono
	 */
	changeOutLineChips(tipo: string) {
		for(let i = 0 ; i < this.outline.length ; i++) {
			if(tipo === this.outline[i].id)
				this.outline[i].selected = false;
			else
				this.outline[i].selected = true;
		}
	}
	

	  /**
	   * 
	   * @param index number - index del outline que pertenece
	   * @param tipo  string - el tipo (categoria) que pertenece el chip
	   */
	  changeAnimationContainers(index: number, tipo: string) {
		this.nextChip = this.getIndexOutLineChips(tipo);
		
		if(this.currentChip < this.nextChip) {
			this.outline[index].animation = 'ani-slideInRight';
		} else if(this.currentChip > this.nextChip){
			this.outline[index].animation = 'ani-slideInLeft';
		}
		// console.log("nextChip", this.nextChip);
		// console.log("current", this.currentChip);
	
		this.currentChip = this.nextChip;
	  }

	/**
	 * 
	 * @param tipo string -  el tipo (categoria) que pertenece el chip
	 * @returns number - index del outline de la categoria 
	 */
	getIndexOutLineChips(tipo) {
		const index = this.outline.findIndex((element, index) => {
			if(element.id == tipo) {
				return true;
			}
		});
		return index;
	}

	/**
	 * 
	 * @param tipo string - el tipo (categoria) que pertenece el chip
	 * @param indexChip  number - index de la posicion del chip (slide)
	 */
	hideChips(tipo: string, indexChip: number) {
		this.currentChipSlide = indexChip;
		let elements = document.querySelectorAll('.slide-ani');	
		if(tipo == 'Favoritos' || tipo == 'Biblioteca') {
			for(let i = 0 ; i < elements.length; i++) {
				if(i !== indexChip ) {
					elements[i].classList.add('ion-hide');
					this.slideChips.update();
				}
			} 
			//this.mostrarCerrarChips = true;
			this.addAnimation(elements[indexChip], 'ani-slideInRight');
		} else if(tipo == 'Zoom' || tipo == 'Todos') {
			for(let i = 1 ; i < elements.length ; i++) {
				if(i !== indexChip) {
					elements[i].classList.add('ion-hide');
					this.slideChips.update();
				}
			}
			this.addAnimation(elements[indexChip], 'ani-slideInRight');
			this.addAnimation(elements[0], 'ani-slideInLeft');
			//this.mostrarCerrarChips = true;	
		}
		this.mostrarCerrarChips = true;
	}

	/**
	 * Muestra todos los chips al presionar X o al chip actual.
	 */
	showAllChips(index: number) {
		let elements = document.querySelectorAll('.slide-ani');
		for(let i = 0 ; i < elements.length; i ++) {
			elements[i].classList.remove('ion-hide');
			this.addAnimation(elements[i], 'ani-fadeIn');
		}
		this.mostrarCerrarChips = false;
		setTimeout(() => {
			this.slideChips.slideTo(index-1, 340);
		}, 150);

		
	}
	
}