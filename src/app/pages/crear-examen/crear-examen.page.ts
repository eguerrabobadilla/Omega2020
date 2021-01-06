import { Component, OnInit,ViewChild,ElementRef,Input } from '@angular/core';
import { ModalController, AlertController,IonInput,PickerController, PopoverController, LoadingController, ActionSheetController, IonSlides } from '@ionic/angular';
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

mobiscroll.settings = {
  theme: 'mobiscroll',
  themeVariant: 'light',
  layout: 'liquid'
};


@Component({
  selector: 'app-crear-examen',
  templateUrl: './crear-examen.page.html',
  styleUrls: ['./crear-examen.page.scss'],
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

  @ViewChild('opcionMultipleUnaRespuesta', {static: false}) opcionMultipleUnaRespuesta: SeleccionUnaRespuestaComponent; 

  public FrmItem: FormGroup;
  public submitAttempt: boolean = false;
  //private item: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;
  EscolaridadSeleccionada:any;
  titulo: any;
  tituloBoton: any;
  GrupoIngles: any;
  showBackButton:boolean = false;
  banderaEdito: boolean=false;
  public Editor = ClassicEditor;
  slideOpts = {
    autoHeight: true
  };
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
      this.FrmItem.controls['FechaTermino'].setValue(event.valueText);
    },
    months: 1
  };
  
  itemPreguntaSeleccionada:any;
  @Input() item;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private pickerController: PickerController,
              private apiChat: ChatService,private apiMaterias: MateriasService, private alertCtrl: AlertController,
              public loadingController: LoadingController,private apiExamenes: ExamenesService,private actionSheetController: ActionSheetController) {
    this.FrmItem = formBuilder.group({
      Id:   [0, Validators.compose([Validators.required])],
      Grupo:   ['', Validators.compose([Validators.required])],
      MateriaId:   ['', Validators.compose([Validators.required])],
      Titulo: ['', Validators.compose([Validators.required])],
      Descripcion: ['', Validators.compose([Validators.required])],
      FechaInicio: ['', Validators.compose([Validators.required])],
      FechaTermino: ['', Validators.compose([Validators.required])],
      DuracionExamen: ['', Validators.compose([Validators.required])],
      PreguntasAleatorias: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    //console.log(this.item); 
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
    console.log(this.item);
    if(this.item != undefined) {
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

      this.titulo = 'Modificar Exámen';
      this.tituloBoton= 'Modificar Exámen';
    } else {
      this.titulo = 'Nuevo Exámen';
      this.tituloBoton = 'Crear Exámen';
    }
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
    this.submitAttempt = true;
    console.log(this.FrmItem.value);
    console.log(this.MateriaSeleccionada);
    
    const loading = await this.loadingController.create({
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

    await loading.present();

    this.item = this.FrmItem.value;
    console.log(this.item);

    const payload = new FormData();
    payload.append('Id', this.item.Id);
    payload.append('Titulo', this.item.Titulo);
    payload.append('Descripcion', this.item.Descripcion);
    payload.append('FechaInicio', this.item.FechaInicio.toString());
    payload.append('FechaTermino', this.item.FechaTermino.toString());
    payload.append('DuracionExamen', this.item.DuracionExamen);
    payload.append('MateriaId', this.MateriaSeleccionada);
    payload.append('Grado', this.gradoSeleccionado);
    payload.append('Grupo', this.grupoSeleccionado);
    payload.append('GrupoIngles', this.GrupoIngles);
    payload.append('PreguntasAleatorias', this.item.PreguntasAleatorias);

    let itemTemp;
    if(this.item.Id == 0) {
      itemTemp = await this.apiExamenes.save(payload).toPromise();
    }
    else {
      const tareaUpload = await this.apiExamenes.update(payload).toPromise();
    }

    this.banderaEdito=true;
    this.submitAttempt = false;

    this.loadingController.dismiss();

    if(this.item.Id == 0) {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Exámen creado con éxito',
        backdropDismiss: false,
        message: 'Se creó el exámen ' + this.FrmItem.get('Titulo').value + ', ¿Desea añadir preguntas al exámen?',
        buttons: [
          {
            text: 'No', handler: () =>  this.closeModal()
          },
          {
            text: 'Añadir', handler: () =>{ 
              //this.FrmItem.reset(); 
              //this.FrmItem.controls['Id'].setValue(0);
              this.item = itemTemp;
              this.slider.slideNext();
            }
          }
        ]
      });
      await alertTerminado.present();
    } else {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Exámen modificado con éxito',
        backdropDismiss: false,
        message: 'Se modificó el exámen ' + this.FrmItem.get('Titulo').value,
        buttons: [
          {
            text: 'Continuar', handler: () =>  this.closeModal()
          }
        ]
      });
      await alertTerminado.present();
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
  /*****Preguntas**** */
  async nuevaPregunta() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Añadir Preguntas',
      cssClass: 'left-align-buttons',
      mode: 'ios',
      buttons: [{
        text: ' Selección (una respuesta)',
        role: 'destructive',
        icon: 'list',
        handler: () => {
          console.log('Delete clicked');
          this.itemPreguntaSeleccionada=undefined;
          this.viewComponentSelect="multipleUnaRespuesta";
        }
      }, {
        text: ' Selección (muchas respuesta)',
        role: 'destructive',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
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

  guardarPregunta() {
    this.opcionMultipleUnaRespuesta.save();
  }

  cancelar() {
    this.viewComponentSelect="listRespuestas";
  }

  onClickPregunta(itemPregunta) {
    //console.log(itemPregunta);
    this.itemPreguntaSeleccionada=itemPregunta;
    this.viewComponentSelect="multipleUnaRespuesta";
  }
  /***************** */
}
