import { Component, OnInit, ChangeDetectorRef,ViewChild,ElementRef } from '@angular/core';
import { ModalController, AlertController, PickerController,IonInput } from '@ionic/angular';
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
  private item: any;
  private files: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder, private cd:ChangeDetectorRef,
              private alertCtrl: AlertController,private apiTareas: TareasService,private apiChat: ChatService,
              private apiMaterias: MateriasService,private pickerController: PickerController) {
    this.FrmItem = formBuilder.group({
      Grupo:   ['', Validators.compose([Validators.required])],
      MateriaId:   ['', Validators.compose([Validators.required])],
      Titulo: ['', Validators.compose([Validators.required])],
      Descripcion: ['', Validators.compose([Validators.required])],
      FechaPublicacion: ['', Validators.compose([Validators.required])],
      HoraPublicacion: ['', Validators.compose([Validators.required])],
      Image: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    
  }

  async crearNoticia() {
    this.submitAttempt = true;

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

    console.log(this.FrmItem.value);
    this.item = this.FrmItem.value;

    const payload = new FormData();
    payload.append('Titulo', this.item.Titulo);
    payload.append('Descripcion', this.item.Descripcion);
    payload.append('FechaPublicacion', this.item.FechaPublicacion.toString());
    payload.append('HoraPublicacion', this.item.HoraPublicacion);
    payload.append('MateriaId', this.MateriaSeleccionada);
    payload.append('Grado', this.gradoSeleccionado);
    payload.append('Grupo', this.grupoSeleccionado);
    payload.append('ImageUpload', this.files, this.files.name);

    const tareaUpload = await this.apiTareas.save(payload).toPromise();

    this.submitAttempt = false;

    const alertTerminado = await this.alertCtrl.create({
      header: 'Tarea creada con éxito',
      message: 'Se creó la tarea ' + this.FrmItem.get('Titulo').value + ', ¿desea crear otra tarea?',
      buttons: [
        {
           text: 'No', handler: () =>  this.modalCtrl.dismiss()
        },
        {
          text: 'Crear otra', handler: () => this.FrmItem.reset()
        }
      ]
    });

    await alertTerminado.present();
  }

  onFileChange($event: any) {
    if( $event.target.files &&  $event.target.files.length) {
      this.texto_adjuntar_portada = 'Foto de Portada Seleccionada';

      this.FrmItem.patchValue({
        Image: $event.target.files[0]
      });

      this.files = $event.target.files[0];
      // need to run CD since file load runs outside of zone
      this.cd.markForCheck();
    }

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
                this.txtGradoGrupo.value = gradoGrupo[0] + ' / ' + gradoGrupo[1];
                this.gradoSeleccionado = gradoGrupo[0];
                this.grupoSeleccionado = gradoGrupo[1];

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
      options.push({text: x.grado + x.grupo , value: x.grado+'/'+x.grupo});
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

    this.grupos = await this.apiMaterias.getMateriasProfesor(this.gradoSeleccionado).toPromise();

    this.grupos.forEach(x => {
      options.push({text: x.nombre , value: x.id});
    });

    return options;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
