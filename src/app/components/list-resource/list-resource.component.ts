import { Component, OnInit, HostListener, ElementRef, ViewChild, Output,EventEmitter } from '@angular/core';
import { PickerController, Platform, ModalController, LoadingController, AlertController, GestureController, IonSlide, IonSlides, IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { RecursosService } from '../../api/recursos.service';
import { Plugins } from '@capacitor/core';
import { File,FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { apiBase } from 'src/app/api/apiBase';
import { NewResourcePage } from 'src/app/new-resource/new-resource.page';
import { CommentStmt } from '@angular/compiler';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
  loading: any;
  evento:any;
  cargarConFiltro = false;
  @Output() updateAutoHeightSlider = new EventEmitter();
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;
  outline = [{id:'Foto', selected: true},
             {id:'Video', selected: true},
             {id:'Enlace', selected: true},
             {id:'Todos', selected: true},
             {id:'Zoom', selected: false}];
  slideOptsdos = {

              passiveListeners : false
            };

  constructor(private pickerController: PickerController, private apiRecursos: RecursosService, private transfer: FileTransfer,
              private file: File, private platform: Platform,private fileOpener: FileOpener,private api: apiBase,
              private modalCrl: ModalController,public loadingController: LoadingController, private alertCtrl: AlertController,
              private inAppBrowser: InAppBrowser,private gestureCtrl: GestureController) {
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
        this.outline.find(x => x.id === 'Zoom').selected = true;
        this.outline.find(x => x.id === 'Todos').selected = false;
        this.esConferencia = false;
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
        this.outline.find(x => x.id === 'Zoom').selected = true;
        this.outline.find(x => x.id === 'Todos').selected = false;
        this.esConferencia = false;
        this.loadingController.dismiss();  
        this.changeIonChip.emit('Archivo');
        setTimeout(() => {
          this.updateAutoHeightSlider.emit();
        }, 300);
      });
    }
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
          this.outline.find(x => x.id === 'Zoom').selected = false;
          this.outline.find(x => x.id === 'Todos').selected = true;
          this.esConferencia = true;
          this.changeIonChip.emit('Clase Virtual');
         }
         else{
          this.outline.find(x => x.id === 'Zoom').selected = true;
          this.outline.find(x => x.id === 'Todos').selected = false;
          this.esConferencia = false;
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
          this.outline.find(x => x.id === 'Zoom').selected = false;
          this.outline.find(x => x.id === 'Todos').selected = true;
          this.esConferencia = true;
          this.changeIonChip.emit('Clase Virtual');
         }
         else{
          this.outline.find(x => x.id === 'Zoom').selected = true;
          this.outline.find(x => x.id === 'Todos').selected = false;
          this.esConferencia = false;
          this.changeIonChip.emit('Archivo');
         }

        this.loadingController.dismiss();
 
        this.cargarConFiltro=false;
      });

    }
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
}
