import { Component, OnInit, ChangeDetectorRef,ViewChild,ElementRef,Input } from '@angular/core';
import { ModalController, AlertController, PickerController,IonInput, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { TareasService } from '../api/tareas.service';
import { ChatService } from '../api/chat.service';
import { MateriasService } from '../api/materias.service';

@Component({
  selector: 'app-nuevo-recurso',
  templateUrl: './nuevo-recurso.page.html',
  styleUrls: ['./nuevo-recurso.page.scss'],
})
export class NuevoRecursoPage implements OnInit {
  @ViewChild('txtGradoGrupo', {static: false}) txtGradoGrupo: IonInput;
  @ViewChild('txtGradoGrupo', {read: ElementRef, static: true}) txtGradoGrupoHTML: ElementRef;
  @ViewChild('txtMateria', {static: false}) txtMateria: IonInput;
  @ViewChild('txtMateria', {read: ElementRef, static: true}) txtMateriaHTML: ElementRef;
  public FrmItem: FormGroup;
  public  texto_adjuntar_portada: string = 'Foto de Portada';
  public submitAttempt: boolean = false;
  //private item: any;
  private files: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;
  EscolaridadSeleccionada:any;
  titulo: any;
  tituloBoton: any;
  banderaEdito: boolean=false;

  @Input() item;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder, private cd:ChangeDetectorRef,
              private alertCtrl: AlertController,private apiTareas: TareasService,private apiChat: ChatService,
              private apiMaterias: MateriasService,private pickerController: PickerController,public loadingController: LoadingController,
              public toastController: ToastController) {
    this.FrmItem = formBuilder.group({
      Id:   [0, Validators.compose([Validators.required])],
      Grupo:   ['', Validators.compose([Validators.required])],
      MateriaId:   ['', Validators.compose([Validators.required])],
      Titulo: ['', Validators.compose([Validators.required])],
      Descripcion: ['', Validators.compose([Validators.required])],
      FechaPublicacion: ['', Validators.compose([Validators.required])],
      HoraPublicacion: ['', Validators.compose([Validators.required])],
      Image: [null, Validators.compose([])]
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    console.log(this.item);
    if(this.item != undefined) {
      this.FrmItem.patchValue(this.item);
      
      this.gradoSeleccionado = this.item.Grado;
      this.grupoSeleccionado = this.item.Grupo;
      this.EscolaridadSeleccionada = this.item.Escolaridad
      this.txtGradoGrupo.value = this.item.Grado + ' / ' + this.item.Grupo + " " + this.item.Escolaridad;

      this.txtMateria.value = this.item.Materia.Nombre;
      this.MateriaSeleccionada = this.item.MateriaId;

      if(this.item.Image != undefined)
        this.texto_adjuntar_portada = 'Foto de Portada Seleccionada';

      this.titulo = 'Modificar Tarea';
      this.tituloBoton= 'Modificar Tarea';
    } else {
      this.titulo = 'Nueva Tarea';
      this.tituloBoton = 'Crear Tarea';
    }
  }

  async crearNoticia() {
    this.submitAttempt = true;

    const loading = await this.loadingController.create({
      message: 'Guardando...'
    });

    console.log(this.FrmItem);
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
    payload.append('FechaPublicacion', this.item.FechaPublicacion.toString());
    payload.append('HoraPublicacion', this.item.HoraPublicacion);
    payload.append('MateriaId', this.MateriaSeleccionada);
    payload.append('Grado', this.gradoSeleccionado);
    payload.append('Grupo', this.grupoSeleccionado);
    
    if(this.files != undefined) //Valida si se selecciono alguna imagen
      payload.append('ImageUpload', this.files, this.files.name);

      console.log(this.item);
      console.log(payload);
    
    if(this.item.Id == 0) {
        const tareaUpload = await this.apiTareas.save(payload).toPromise();
    }
    else {
        const tareaUpload =await this.apiTareas.update(payload).toPromise();
    }

    this.banderaEdito=true;
    this.submitAttempt = false;

    this.loadingController.dismiss();

    if(this.item.Id == 0) {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Tarea creada con éxito',
        backdropDismiss: false,
        message: 'Se creó la tarea ' + this.FrmItem.get('Titulo').value + ', ¿desea crear otra tarea?',
        buttons: [
          {
            text: 'No', handler: () =>  this.closeModal()
          },
          {
            text: 'Crear otra', handler: () =>{ 
              this.FrmItem.reset(); 
              this.FrmItem.controls['Id'].setValue(0);
            }
          }
        ]
      });
      await alertTerminado.present();
    } else {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Tarea modificada con éxito',
        backdropDismiss: false,
        message: 'Se modificó la tarea ' + this.FrmItem.get('Titulo').value,
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
    if( $event.target.files &&  $event.target.files.length) {
      const re = new RegExp('image\/(png|jpg|bmp|jpeg|gif|svg+xml)', 'g');      
      
      //Solo se permiten formatos de imagen;
      if(re.test($event.target.files[0].type)==false) {
        this.presentToast("Archivo no valido, solo se permite subir imágenes.");
        this.texto_adjuntar_portada = 'Foto de Portada';
        return;
      }

      this.texto_adjuntar_portada = 'Foto de Portada Seleccionada';

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
                console.log("entro");
                console.log(value);
                const gradoGrupo = value.Grupos.value.split("/");
                //this.txtGradoGrupo.value = gradoGrupo[0] + ' / ' + gradoGrupo[1];
                this.txtGradoGrupo.value = value.Grupos.text;
                this.gradoSeleccionado = gradoGrupo[0];
                this.grupoSeleccionado = gradoGrupo[1];
                this.EscolaridadSeleccionada = gradoGrupo[2];

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
      options.push({text: x.Grado + x.Grupo + ' ' + x.Escolaridad, value: x.Grado+'/'+x.Grupo+'/'+x.Escolaridad});
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

    this.grupos = await this.apiMaterias.getMateriasProfesor(this.EscolaridadSeleccionada,this.gradoSeleccionado,this.grupoSeleccionado).toPromise();

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
