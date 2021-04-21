import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ModalController, AlertController,IonInput,PickerController, PopoverController, LoadingController, ActionSheetController, IonSlides, Platform, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { ForumService } from '../../api/forum.service';
import { MateriasService } from 'src/app/api/materias.service';
import { ChatService } from 'src/app/api/chat.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { mobiscroll, MbscCalendarOptions, MbscCalendar, MbscCalendarComponent } from '@mobiscroll/angular';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { ExamenesService } from 'src/app/api/examenes.service';
import { SeleccionUnaRespuestaComponent } from 'src/app/components/examenes/seleccion-una-respuesta/seleccion-una-respuesta.component';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { UploadAdapter } from 'src/app/class/UploadAdapter';
import { HttpParams, HttpClient } from "@angular/common/http";
import { apiBase } from 'src/app/api/apiBase';
import { Plugins } from '@capacitor/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { PreguntasService } from 'src/app/api/preguntas.service';
import { ListPreguntasComponent } from 'src/app/components/examenes/list-preguntas/list-preguntas.component';
import { File,FileEntry } from '@ionic-native/file/ngx';
import Quill from 'quill';
import  ImageResize  from 'src/assets/quill-image-resize-module-fix-for-mobile';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { RelacionarComponent } from 'src/app/components/examenes/relacionar/relacionar.component';
import { ExplorerFilePage } from '../explorer-file/explorer-file.page';


let BaseImageFormat = Quill.import('formats/image');
const ImageFormatAttributesList = [
  'alt',
  'height',
  'width',
  'style'
];

class ImageFormat extends BaseImageFormat {
  domNode;
  static formats(domNode) {
    return ImageFormatAttributesList.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  format(name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Quill.register('modules/imageResize', ImageResize);
Quill.register('attributors/style/size', true);
Quill.register(ImageFormat, true);

mobiscroll.settings = {
  theme: 'mobiscroll',
  themeVariant: 'light',
  layout: 'liquid'
};


@Component({
  selector: 'app-crear-examen',
  templateUrl: './crear-examen.page.html',
  styleUrls: ['./crear-examen.page.scss']
  
  
})
export class CrearExamenPage implements OnInit {
  @ViewChild('txtGradoGrupo', {static: false}) txtGradoGrupo: IonInput;
  @ViewChild('txtGradoGrupo', {read: ElementRef, static: true}) txtGradoGrupoHTML: ElementRef;
  @ViewChild('txtMateria', {static: false}) txtMateria: IonInput;
  @ViewChild('txtMateria', {read: ElementRef, static: true}) txtMateriaHTML: ElementRef;
  @ViewChild('mobi', {static: false}) mobi: MbscCalendar; 
  @ViewChild('mobi2', {static: false}) mobi2: MbscCalendar; 
  @ViewChild('CKEDITOR', {static: false}) CKEDITOR: CKEditorComponent; 
  @ViewChild('slider', {static: false}) slider: IonSlides;
  @ViewChild('componentListaPreguntas', {static: false}) componentListaPreguntas: ListPreguntasComponent;
  @ViewChild('inputFileBanco', {read: ElementRef, static: false}) inputFileBancoHTML: ElementRef;
  @ViewChild('quill', {read: ElementRef, static: false}) quill: ElementRef;

  @ViewChild('opcionMultipleUnaRespuesta', {static: false}) opcionMultipleUnaRespuesta: SeleccionUnaRespuestaComponent; 
  @ViewChild('relacionarPreguntas', {static: false}) relacionarPreguntas: RelacionarComponent; 

  public FrmItem: FormGroup;
  public submitAttempt: boolean = false;
  spiner=true;
  loading: any;
  //private item: any;
  grupos: any[] = [];
   editor: any;
  materias: any[] = [];
  descripcionQuill:string;
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;
  EscolaridadSeleccionada:any;
  titulo: any;
  tituloBoton: any;
  GrupoIngles: any;
  showBackButton:boolean = false;
  banderaEdito: boolean=false;
  permissionStorageDowload=false;
  public Editor = ClassicEditor;
  private fileBlob: any;
  slideOpts = {

    autoHeight: true,
    allowTouchMove: false,
    passiveListeners: false,
    preloadImages :false

  };
   quillConfiguration = {
    'toolbar': [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['code-block'],

      [{ 'size': ['small', false, 'large', 'huge'] }],// custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                     // text direction

        // custom dropdown

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
                              // remove formatting button

      ['link', 'image', 'video'],                         // link and image, video


    ],
    imageResize: true,
  
   
  };
  editorStyle = { 'width':'100%;' }
  viewComponentSelect = 'listRespuestas';

  settings: MbscCalendarOptions = {
    theme: 'mobiscroll',
    display: 'bottom',
    themeVariant: 'light',
    calendarScroll: 'vertical',
    controls: ['calendar','time'],
    tabs: false,
    buttons: [
      'set',
      {
          text: 'Aceptar',
          handler: 'set',
          icon: 'checkmark',
          cssClass: 'my-btn'
      }
    ],
    onSet: (event, inst) => {
      //this.FrmItem.controls['FechaInicio'].setValue(inst.getVal());
      this.FrmItem.controls['FechaInicio'].setValue(event.valueText);
    },
    months: 1
  };

  
  settings2: MbscCalendarOptions = {
    theme: 'mobiscroll',
    display: 'bottom',
    themeVariant: 'light',
    calendarScroll: 'vertical',
    controls: ['calendar','time'],
    tabs: false,
    buttons: [
      'set',
      {
          text: 'Aceptar',
          handler: 'set',
          icon: 'checkmark',
          cssClass: 'my-btn'
      }
    ],
    onSet: (event, inst) => {
      //this.FrmItem.controls['FechaTermino'].setValue(inst.getVal());
      this.FrmItem.controls['FechaTermino'].setValue(event.valueText);
    },
    months: 1
  };
  
  itemPreguntaSeleccionada:any;
  @Input() item;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private pickerController: PickerController,
              private apiChat: ChatService,private apiMaterias: MateriasService, private alertCtrl: AlertController,
              public loadingController: LoadingController,private apiExamenes: ExamenesService,private actionSheetController: ActionSheetController,
              public http: HttpClient,private api: apiBase,private platform: Platform,private apiPreguntas: PreguntasService,
              public toastController: ToastController,private cd: ChangeDetectorRef,private transfer: FileTransfer,private file: File,private renderer: Renderer2,
              private androidPermissions: AndroidPermissions,public alertController: AlertController) {
    this.FrmItem = formBuilder.group({
      Id:   [0, Validators.compose([Validators.required])],
      Grupo:   ['', Validators.compose([Validators.required])],
      MateriaId:   ['', Validators.compose([Validators.required])],
      Titulo: ['', Validators.compose([Validators.required])],
      Descripcion: [''],
      FechaInicio: ['', Validators.compose([Validators.required])],
      FechaTermino: ['', Validators.compose([Validators.required])],
      DuracionExamen: ['', Validators.compose([Validators.required])],
      PreguntasAleatorias: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    //console.log(this.item); 
    if(this.platform.is("android") ) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => { this.permissionStorageDowload=result.hasPermission; console.log('Has permission?', result.hasPermission) },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
    }
  }

  editorCreated(quill){
    this.editor = quill;
    this.descripcionQuill=this.item.Descripcion;
  this.editor.setContents(this.editor.clipboard.convert(`<p style="color:black">Hello world</p>`));
}

  async openPickerGrupos() {
    const picker = await this.pickerController.create({
        mode : 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aceptar',
            handler:  (value: any) => {
                const gradoGrupo = value.Grupos.value.split("/");
                //this.txtGradoGrupo.value = gradoGrupo[0] + ' / ' + gradoGrupo[1];
                this.txtGradoGrupo.value = value.Grupos.text;
                this.gradoSeleccionado = gradoGrupo[0];
                this.grupoSeleccionado = gradoGrupo[1];
                this.EscolaridadSeleccionada = gradoGrupo[2];
                this.GrupoIngles =gradoGrupo[3];

                this.txtMateria.value = "";
                this.MateriaSeleccionada = "";
            }
          }
        ],
        columns: [{
            name: 'Grupos',
            options: await this.getColumnGrupos()
          }
        ]
    });
    
    picker.present();

  }

  ionViewWillEnter() {

    if(this.item != undefined) {
      //console.log(this.formatAMPM(new Date(this.item.FechaInicio)));      

      this.mobi.instance.setDate(new Date(this.item.FechaInicio));
      this.mobi2.instance.setDate(new Date(this.item.FechaTermino));

      this.item.FechaInicio = this.formatAMPM(new Date(this.item.FechaInicio));
      this.item.FechaTermino = this.formatAMPM(new Date(this.item.FechaTermino));

     
      this.FrmItem.patchValue(this.item);
 
      this.gradoSeleccionado = this.item.Grado;
      this.grupoSeleccionado = this.item.Grupo;
      this.EscolaridadSeleccionada = this.item.Escolaridad
      if(this.item.GrupoIngles=='NO')
        this.txtGradoGrupo.value = this.item.Grado + this.item.Grupo + " " + this.item.Escolaridad;
      else
        this.txtGradoGrupo.value = 'Level ' + this.item.Grado  + this.item.Grupo + " " + this.item.Escolaridad;

      this.txtMateria.value = this.item.Materia.Nombre;
      this.MateriaSeleccionada = this.item.MateriaId;
      this.GrupoIngles = this.item.GrupoIngles;

      /*if(this.item.Image != undefined)
        this.texto_adjuntar_portada = 'Foto de Portada Seleccionada';*/

      this.titulo = 'Modificar Examen';
      this.tituloBoton= 'Modificar Examen';
    } else {
      this.titulo = 'Nuevo Examen';
      this.tituloBoton = 'Crear Examen';
    }
  }

   formatAMPM(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);;
    const day = ('0' + date.getDate()).slice(-2);;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    //const strTime = hours + ':' + minutes + ' ' + ampm;
    const strTime = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
    return strTime;
  }
  

  async getColumnGrupos() {
    const options = [];

    
    this.grupos = await this.apiChat.getGruposMaestros().toPromise();
    
    //options.push({text: 'Todas' , value: 0});

    this.grupos.forEach(x => {
      if(x.GrupoIngles=="NO") {
        options.push({text: x.Grado + x.Grupo + ' ' + x.Escolaridad, value: x.Grado+'/'+x.Grupo+'/'+x.Escolaridad+'/'+x.GrupoIngles});
        //this.GrupoIngles="NO"
      }
      else {
        options.push({text: 'Level ' + x.Grado + x.Grupo + ' ' + x.Escolaridad, value: x.Grado+'/'+x.Grupo+'/'+x.Escolaridad+'/'+x.GrupoIngles});
        //this.GrupoIngles="SI"
      }
    });

    return options;
  }

  
  async openPickerMaterias() {
    const picker = await this.pickerController.create({
        mode : 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aceptar',
            handler:  (value: any) => {
                this.txtMateria.value = value.Materias.text;
                this.MateriaSeleccionada = value.Materias.value;
            }
          }
        ],
        columns: [{
            name: 'Materias',
            options: await this.getColumnMaterias()
          }
        ]
    });
    
    picker.present();

  }

  async getColumnMaterias() {
    const options = [];



    this.grupos = await this.apiMaterias.getMateriasProfesor(this.EscolaridadSeleccionada,this.gradoSeleccionado,this.grupoSeleccionado,this.GrupoIngles).toPromise();

    this.grupos.forEach(x => {
      options.push({text: x.Nombre , value: x.Id});
    });

    return options;
  }

  async crearExamen() {
    try 
    {
      this.submitAttempt = true;
      //console.log(this.FrmItem.value);
      //console.log(this.MateriaSeleccionada);
      
      this.loading = await this.loadingController.create({
        message: 'Guardando...'
      });

      if (!this.FrmItem.valid) {

        const alert = await  this.alertCtrl.create({
          header: 'No concluiste con el formulario',
          subHeader: 'El formulario se encuentra incompleto, favor de completar los datos faltantes.',
          mode: 'ios',
          buttons: ['Aceptar']
        });

        await alert.present();
        return;
      }

      await this.loading.present();

      this.item = this.FrmItem.value;
      console.log(this.item);
      console.log(this.item.FechaInicio);
      
      const payload = new FormData();
      payload.append('Id', this.item.Id);
      payload.append('Titulo', this.item.Titulo);
      payload.append('Descripcion', this.item.Descripcion);
      payload.append('FechaInicio', new Date(this.item.FechaInicio.toString()).toISOString());
      payload.append('FechaTermino', new Date(this.item.FechaTermino.toString()).toISOString());
      payload.append('DuracionExamen', this.item.DuracionExamen);
      payload.append('MateriaId', this.MateriaSeleccionada);
      payload.append('Grado', this.gradoSeleccionado);
      payload.append('Grupo', this.grupoSeleccionado);
      payload.append('GrupoIngles', this.GrupoIngles);
      payload.append('PreguntasAleatorias', this.item.PreguntasAleatorias);

      let itemTemp;
      console.log(this.item);
      if(this.item.Id == 0) {
        itemTemp = await this.apiExamenes.save(payload).toPromise();
      }
      else {
        const tareaUpload = await this.apiExamenes.update(payload).toPromise();
      }

      this.banderaEdito=true;
      this.submitAttempt = false;

      await this.loadingController.dismiss();

      if(this.item.Id == 0) {
        const alertTerminado = await this.alertCtrl.create({
          header: 'Examen creado con éxito',
          backdropDismiss: false,
          message: 'Se creó el Examen ' + this.FrmItem.get('Titulo').value + ', ¿Desea añadir preguntas al Examen?',
          buttons: [
            {
              text: 'No', handler: () =>  this.closeModal()
            },
            {
              text: 'Añadir', handler: () =>{ 
                //this.FrmItem.reset(); 
                //this.FrmItem.controls['Id'].setValue(0);
                console.log(itemTemp);
                this.item = itemTemp;
                this.FrmItem.controls['Id'].setValue(this.item.Id);
                
                this.titulo = 'Modificar Examen';
                this.tituloBoton= 'Modificar Examen';

                this.slider.slideNext();
              }
            }
          ]
        });
        await alertTerminado.present();
      } else {
        const alertTerminado = await this.alertCtrl.create({
          header: 'Examen modificado con éxito',
          backdropDismiss: false,
          message: 'Se modificó el Examen ' + this.FrmItem.get('Titulo').value,
          buttons: [
            {
              text: 'Continuar', handler: () =>  this.closeModal()
            }
          ]
        });
        await alertTerminado.present();
      }
    }
    catch(err) {
      await this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'LBS Plus',
        //subHeader: 'Subtitle',
        message: err.error,
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }
  }

  ionFocusFechaInicio(){
    this.mobi.instance.show();
  }

  ionFocusFechaTermino() {
    this.mobi2.instance.show();
  }
  
  closeModal() {
    this.modalCtrl.dismiss({
      banderaEdito : this.banderaEdito
    });
  }

  backMain() {
    this.slider.slidePrev();
  }

  verPreguntas(){
    this.slider.slideNext();
  }

  ionSlideDidChange() {
    console.log("ionSlideDidChange");
    this.slider.getActiveIndex().then(index => {
       //console.log(index);
       if(index > 0)
         this.showBackButton=true;
        else
          this.showBackButton=false;
    })
  }

  onReadyRichText($event){
    $event.plugins.get('FileRepository').createUploadAdapter = (loader)=> {
      console.log('loader : ', loader)
      console.log(btoa(loader.file));
      return new UploadAdapter(loader,this.http,this.api);
    };
  }

  /*****Preguntas**** */
  async nuevaPregunta() {
    try {

        this.spiner = true;

        const result = await this.apiExamenes.getTotalExamenesIniciados(this.item.Id).toPromise();

        this.spiner = false;

        const actionSheet = await this.actionSheetController.create({
          header: 'Añadir Preguntas',
          cssClass: 'left-align-buttons',
          mode: 'ios',
          buttons: [{
              text: ' Relacionar',
              role: 'destructive',
              icon: 'git-compare-outline',
              handler: () => {
                this.itemPreguntaSeleccionada=undefined;
                this.viewComponentSelect="relacionarPreguntas";
              }
          },
          {
            text: ' Selección (una respuesta)',
            role: 'destructive',
            icon: 'list',
            handler: () => {
              this.itemPreguntaSeleccionada=undefined;
              this.viewComponentSelect="multipleUnaRespuesta";
            }
          }/*, {
            text: ' Selección (muchas respuesta)',
            role: 'destructive',
            icon: 'share',
            handler: () => {
              console.log('Share clicked');
            }
          }*/,
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }]
        });
        await actionSheet.present();

    } catch(err) {
        this.spiner=false;

        const alert = await this.alertCtrl.create({
          header: 'LBS Plus',
          //subHeader: 'Subtitle',
          message: err.error,
          buttons: ['Aceptar']
        });
    
        await alert.present();
    }
  }

  async bancoPreguntas() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Añadir Preguntas',
      cssClass: 'left-align-buttons',
      mode: 'ios',
      buttons: [{
        text: ' Exportar',
        role: 'destructive',
        icon: 'download',
        handler: async () => {
          console.log('Delete clicked');
          const { Browser } = Plugins;
          if (this.platform.is('cordova')) {
            //this.download(`${this.api.url}/resources/${item.PathRecurso}`);
            this.loading =await this.loadingController.create({
              //cssClass: 'my-custom-class',
              message: 'Exportando...',
              duration: 120000
            });
            
            this.loading.present();

            const url=`${this.api.url}/api/preguntas/dowload/${this.item.Id}`;
            console.log(url);
            let fileName=`LBS${this.item.Id}-${this.item.Grado}${this.item.Grupo}-${this.item.Escolaridad}`.replace(' ','-');
            this.download(url,fileName);
            
          } else {
            this.loading =await this.loadingController.create({
              //cssClass: 'my-custom-class',
              message: 'Exportando...',
              duration: 120000
            });
            
            this.loading.present();

            let fileName=`LBS${this.item.Id}-${this.item.Grado}${this.item.Grupo}-${this.item.Escolaridad}`.replace(' ','-');
            await this.apiPreguntas.getBancoPreguntas(this.item.Id,fileName);
            this.loadingController.dismiss();
          }
        }
      }, {
        text: ' Importar',
        role: 'destructive',
        icon: 'share',
         handler: async () => {
          console.log('Share clicked');
          if (this.platform.is('cordova')) {
            const modal = await this.modalCtrl.create({
              component: ExplorerFilePage
              //cssClass: 'my-custom-class'
            });
            
            await modal.present();

            let resp = await modal.onDidDismiss();
            console.log(resp);

            resp.data.file.file(file => this.readFile(file));
  
          } else {
            this.inputFileBancoHTML.nativeElement.click();
          }

        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
        this.fileBlob = new Blob([reader.result], {
            type: file.type
        });

        this.onFileChangeMovil();
    };

    reader.readAsArrayBuffer(file);
   }

  async download(url,NameFile) {
    const token = localStorage.getItem('USER_INFO');

    if(this.platform.is("android") && this.permissionStorageDowload==false) {
      await this.androidPermissions.requestPermissions(
          [
              this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
              this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          ]
      );
    }
    
    let options = {
      headers: {
        'authorization': 'Bearer ' + token
      }
    
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    const extension = url.split('.').pop();
    const pathDownload = this.platform.is("android") ? this.file.dataDirectory  :  this.file.dataDirectory;
    //const pathDownload = this.platform.is("android") ? this.file.externalDataDirectory :  this.file.documentsDirectory;
    //const pathDownload = this.platform.is("android") ? this.file.externalRootDirectory + "download/" :  this.file.documentsDirectory;

    try {
      await this.file.checkFile(pathDownload ,"exportPreguntas/" + NameFile + '.zip');
      await this.file.removeFile(pathDownload + "exportPreguntas/" , NameFile + '.zip');
    } catch (error) {
      console.error(error);
    }
 

    fileTransfer.download(url, pathDownload + "exportPreguntas/" + NameFile + '.zip',true,options).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        this.loadingController.dismiss();
        this.presentToast("Examen exportado");
    }, (error) => {
      // handle error
      console.log(error);
      this.loadingController.dismiss();
      alert(error.exception);
    });

  }
  checkPermissions(){

  }

  guardarPregunta() {
    if(this.viewComponentSelect=='multipleUnaRespuesta')
      this.opcionMultipleUnaRespuesta.save();
    else if(this.viewComponentSelect=='relacionarPreguntas')
      this.relacionarPreguntas.save();
  }

  cancelar() {
    this.viewComponentSelect="listRespuestas";
  }

  onClickPregunta(itemPregunta) {
    console.log(itemPregunta);
    if(itemPregunta.TipoPregunta=='multipleUnaRespuesta') {
      this.itemPreguntaSeleccionada=itemPregunta;
      this.viewComponentSelect="multipleUnaRespuesta";
    }
    else if(itemPregunta.TipoPregunta=='relacionarPreguntas') {
      this.itemPreguntaSeleccionada=itemPregunta;
      this.viewComponentSelect="relacionarPreguntas";
    }

  }

  async onFileChange($event: any) {
    console.log("onFileChange");
    try {
      if( $event.target.files &&  $event.target.files.length) {
        const re = new RegExp('\.zip', 'g');      
        
        //Solo se permiten formatos de imagen;
        if(re.test($event.target.files[0].type)==false) {
          this.presentToast("Archivo no valido, solo se permite archivos zip.");
          return;
        }

        const file=$event.target.files[0];

        const payload = new FormData();
        payload.append('ExamenId', this.item.Id);  
        payload.append('File', file, file.name);

        this.loading =await this.loadingController.create({
          //cssClass: 'my-custom-class',
          message: 'Importando...',
          duration: 120000
        });
        
        const tareaUpload = await this.apiPreguntas.setBancosPreguntas(payload).toPromise();

        this.loadingController.dismiss();

        this.componentListaPreguntas.loadData2();

        this.presentToast("Examen importado");

        this.inputFileBancoHTML.nativeElement.value = "";

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      }
    }
    catch(err) {
      this.inputFileBancoHTML.nativeElement.value = "";
      await this.loadingController.dismiss();

      const alert = await this.alertController.create({
        header: 'LBS Plus',
        //subHeader: 'Subtitle',
        message: err.error,
        buttons: ['Aceptar']
      });
  
      this.cd.markForCheck();
      await alert.present();
    }
  }

  async onFileChangeMovil() {
    console.log("onFileChange");
    try {
        const re = new RegExp('\.zip', 'g');      
        
        //Solo se permiten formatos de imagen;
        if(re.test(this.fileBlob.type)==false) {
          this.presentToast("Archivo no valido, solo se permite archivos zip.");
          return;
        }

        const file=this.fileBlob;

        const payload = new FormData();
        payload.append('ExamenId', this.item.Id);  
        payload.append('File', file, file.name);

        this.loading =await this.loadingController.create({
          //cssClass: 'my-custom-class',
          message: 'Importando...',
          duration: 120000
        });
        
        const tareaUpload = await this.apiPreguntas.setBancosPreguntas(payload).toPromise();

        this.loadingController.dismiss();

        this.componentListaPreguntas.loadData2();

        this.presentToast("Examen importado");

        //this.inputFileBancoHTML.nativeElement.value = "";

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
    
    }
    catch(err) {
      this.inputFileBancoHTML.nativeElement.value = "";
      await this.loadingController.dismiss();

      const alert = await this.alertController.create({
        header: 'LBS Plus',
        //subHeader: 'Subtitle',
        message: err.error,
        buttons: ['Aceptar']
      });
  
      this.cd.markForCheck();
      await alert.present();
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      color: "dark",
      mode: "ios",
      cssClass : "toastCenter",
      duration: 3000
    });

    toast.present();
  }

  loadSpinner(statusSpinner) {
    console.log(statusSpinner);
    this.spiner = statusSpinner;
  }
  /***************** */
}
