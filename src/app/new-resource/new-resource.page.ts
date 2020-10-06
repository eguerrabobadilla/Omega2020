import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2,Input} from '@angular/core';
import { ModalController, AlertController, PickerController, IonInput, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { RecursosService } from '../api/recursos.service';
import { ChatService } from '../api/chat.service';
import { MateriasService } from '../api/materias.service';

@Component({
  selector: 'app-new-resource',
  templateUrl: './new-resource.page.html',
  styleUrls: ['./new-resource.page.scss'],
})
export class NewResourcePage implements OnInit {
  @ViewChild('txtGradoGrupo', {static: false}) txtGradoGrupo: IonInput;
  @ViewChild('txtGradoGrupo', {read: ElementRef, static: true}) txtGradoGrupoHTML: ElementRef;
  @ViewChild('txtMateria', {static: false}) txtMateria: IonInput;
  @ViewChild('txtMateria', {read: ElementRef, static: true}) txtMateriaHTML: ElementRef;
  @ViewChild('txtFecha', {static: false}) txtFecha: IonInput;
  @ViewChild('txtFecha', {read: ElementRef, static: true}) txtFechaHTML: ElementRef;
  public FrmItem: FormGroup;
  public  texto_adjuntar_portada: string = 'Adjuntar Recurso';
  public submitAttempt: boolean = false;
  //private item: any;
  private files: any;
  meses: string[];
  semanas: string[];
  mesSeleccionado: any;
  semanaSeleccionada: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;
  EscolaridadSeleccionada:any;
  titulo: any;
  tituloBoton: any;
  @Input() item;
  banderaEdito: boolean=false;
  GrupoIngles: any;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private cd:ChangeDetectorRef,
              private alertCtrl: AlertController, private apiRecursos: RecursosService, private pickerController: PickerController,
              private renderer: Renderer2,private apiChat: ChatService,private apiMaterias: MateriasService,public loadingController: LoadingController,
              public toastController: ToastController) {
    this.FrmItem = formBuilder.group({
      Id:   [0, Validators.compose([Validators.required])],
      Grupo:   ['', Validators.compose([Validators.required])],
      MateriaId:   ['', Validators.compose([Validators.required])],
      Titulo: ['', Validators.compose([Validators.required])],
      Descripcion: ['', Validators.compose([Validators.required])],
      FechaPublicacion: ['', Validators.compose([Validators.required])],
      Image: [null, Validators.compose([])]
    });
  }

  ngOnInit() {
    this.meses   = ['Agosto','Septiembre','Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febreo', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
    this.semanas = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
  }

  ionViewWillEnter() {
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

      this.semanaSeleccionada = this.item.Semana;
      this.mesSeleccionado= this.item.Mes;
      this.txtFecha.value = this.item.Mes + ' / ' + this.item.Semana

      if(this.item.PathRecurso != undefined)
        this.texto_adjuntar_portada = 'Recurso Seleccionado';

      this.titulo = 'Modificar Recursos';
      this.tituloBoton= 'Modificar Recurso';
    } else {
      this.titulo = 'Nuevo Recurso';
      this.tituloBoton = 'Crear Recurso';
    }
  }

  async openPicker() {
    const picker = await this.pickerController.create({
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (value: any) => {
            this.txtFecha.value = value.Meses.value + ' / ' + value.Semanas.value;
            this.semanaSeleccionada = value.Semanas.value;
            this.mesSeleccionado = value.Meses.value;
          }
        }
      ],
      columns:[{
          name: 'Meses',
          options: this.getColumnOptionsMeses()
        },
        {
          name: 'Semanas',
          options: this.getColumnOptionsSemanas()
        }
      ],
      mode : 'ios',
    });

    picker.columns[0].selectedIndex = this.getRealMonth();
    picker.present();

  }

  

  getRealMonth() {
    /*
    Dado que el año escolar no inicia en Enero se tiene que ajustar para llenar el picker 
    ejemplo enero en lugar de ser index 1 es 6
    */
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
    let options = [];

    this.meses.forEach(x => {
      options.push({text: x , value: x});
    });

    return options;
  }

  getColumnOptionsSemanas() {
    let options = [];

    this.semanas.forEach(x => {
      options.push({text: x , value: x});
    });

    return options;
  }

  async crearNoticia() {
    this.submitAttempt = true;

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

    console.log(this.FrmItem.value);
    this.item = this.FrmItem.value;

     
    const payload = new FormData();
    payload.append('Id', this.item.Id);
    payload.append('Titulo', this.item.Titulo);
    payload.append('Descripcion', this.item.Descripcion);
    payload.append('Ano', '2020');
    payload.append('Mes', this.mesSeleccionado);
    payload.append('Semana', this.semanaSeleccionada);
    payload.append('MateriaId', this.MateriaSeleccionada);
    payload.append('Grado', this.gradoSeleccionado);
    payload.append('Grupo', this.grupoSeleccionado);
    payload.append('GrupoIngles', this.GrupoIngles);
    //payload.append('ItemUpload', this.files, this.files.name);
    if(this.files != undefined) //Valida si se selecciono alguna imagen
      payload.append('ItemUpload', this.files, this.files.name);

    if(this.item.Id == 0)
      await this.apiRecursos.save(payload).toPromise();
    else
      await this.apiRecursos.update(payload).toPromise();

    this.banderaEdito=true;
    this.submitAttempt = false;

    this.loadingController.dismiss();

    if(this.item.Id == 0) {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Recurso creada con éxito',
        backdropDismiss: false,
        message: 'Se creó el recurso ' + this.FrmItem.get('Titulo').value + ', ¿desea subir otro recurso?',
        buttons: [
          {
             text: 'No', handler: () =>  this.closeModal()
          },
          {
            text: 'Crear otro', handler: () => { 
              this.FrmItem.reset() 
              this.FrmItem.controls['Id'].setValue(0);
            }
          }
        ]
      });

      await alertTerminado.present();
    } else {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Recurso modificado con éxito',
        backdropDismiss: false,
        message: 'Se modificó el recurso ' + this.FrmItem.get('Titulo').value,
        buttons: [
          {
            text: 'Continuar', handler: () =>  this.closeModal()
          }
        ]
      });
      await alertTerminado.present();
    }


    
  }

  onFileChange($event: any) {
    console.log($event.target.files[0].type);
    if( $event.target.files &&  $event.target.files.length) {
      const re = new RegExp('(application|text)\/(x-msdownload|javascript|x-pkcs12|html)', 'g');   

      //No se permite subir archivo con extesione exe;
      if(re.test($event.target.files[0].type)==true) {
        this.presentToast("No se permite subir este tipo de archivo");
        this.texto_adjuntar_portada = 'Foto de Portada';
        return;
      }

      this.texto_adjuntar_portada = 'Recurso Seleccionado';

      this.FrmItem.patchValue({
        Image: $event.target.files[0]
      });

      this.files = $event.target.files[0];
      // need to run CD since file load runs outside of zone
      this.cd.markForCheck();
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


  closeModal() {
    this.modalCtrl.dismiss({
      banderaEdito : this.banderaEdito
    });
  }


}
