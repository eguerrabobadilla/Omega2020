import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ModalController, AlertController,IonInput,PickerController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { ForumService } from '../../api/forum.service';
import { MateriasService } from 'src/app/api/materias.service';
import { ChatService } from 'src/app/api/chat.service';

@Component({
  selector: 'app-crear-forum',
  templateUrl: './crear-forum.page.html',
  styleUrls: ['./crear-forum.page.scss'],
})
export class CrearForumPage implements OnInit {
  @ViewChild('txtGradoGrupo', {static: false}) txtGradoGrupo: IonInput;
  @ViewChild('txtGradoGrupo', {read: ElementRef, static: true}) txtGradoGrupoHTML: ElementRef;
  @ViewChild('txtMateria', {static: false}) txtMateria: IonInput;
  @ViewChild('txtMateria', {read: ElementRef, static: true}) txtMateriaHTML: ElementRef;
  public FrmItem: FormGroup;
  public submitAttempt: boolean = false;
  private item: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder,private alertCtrl: AlertController,
              private apiForo: ForumService,private apiChat: ChatService,private apiMaterias: MateriasService,
              private pickerController: PickerController) {
    this.FrmItem = formBuilder.group({
      Grupo:   ['', Validators.compose([Validators.required])],
      MateriaId:   ['', Validators.compose([Validators.required])],
      Nombre: ['', Validators.compose([Validators.required])],
      Descrpcion: ['', Validators.compose([Validators.required])],
      FechaPublicacion: ['', Validators.compose([Validators.required])],
      HoraPublicacion: ['', Validators.compose([Validators.required])]
    });
   }

  ngOnInit() {

  }

  async crearForo() {
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
    this.item.Grado = this.gradoSeleccionado;
    this.item.Grupo = this.grupoSeleccionado;
    this.item.MateriaId = this.MateriaSeleccionada;

    const saveForo = await this.apiForo.saveForo(this.item).toPromise();
    this.submitAttempt = false;
    
    console.log("guardado2");
    const alertTerminado = await this.alertCtrl.create({
      header: 'Foro creado con éxito',
      message: 'Se creó el foro ' + this.FrmItem.get('Nombre').value + ', ¿desea crear otro foro?',
      buttons: [
        {
           text: 'No', handler: () =>  this.modalCtrl.dismiss()
        },
        {
          text: 'Crear otro', handler: () => this.FrmItem.reset()
        }
      ]
    });

    await alertTerminado.present();
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
