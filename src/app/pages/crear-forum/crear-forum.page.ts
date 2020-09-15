import { Component, OnInit,ViewChild,ElementRef,Input } from '@angular/core';
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
  //private item: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;
  titulo: any;

  @Input() item;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder,private alertCtrl: AlertController,
              private apiForo: ForumService,private apiChat: ChatService,private apiMaterias: MateriasService,
              private pickerController: PickerController) {
    this.FrmItem = formBuilder.group({
      Id:   [0, Validators.compose([Validators.required])],
      Grupo:   ['', Validators.compose([Validators.required])],
      MateriaId:   ['', Validators.compose([Validators.required])],
      Nombre: ['', Validators.compose([Validators.required])],
      Descrpcion: ['', Validators.compose([Validators.required])],
      FechaPublicacion: ['', Validators.compose([Validators.required])],
      HoraPulicacion: ['07:00', Validators.compose([Validators.required])]
    });
   }

  ngOnInit() {

  }

  ionViewWillEnter() {
    if(this.item != undefined) {
      this.FrmItem.patchValue(this.item);
      
      this.gradoSeleccionado = this.item.Grado;
      this.grupoSeleccionado = this.item.Grupo;
      this.txtGradoGrupo.value = this.item.Grado + ' / ' + this.item.Grupo;

      this.txtMateria.value = this.item.Materia.Nombre;
      this.MateriaSeleccionada = this.item.MateriaId;

      this.titulo = 'Modificar Foro';
    } else {
      this.titulo = 'Nuevo Foro';
    }
  }

  async crearForo() {
    this.submitAttempt = true;
    //let tempHora = null;

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
    /*const d = new Date(this.item.HoraPulicacion);
    console.log(d);
    tempHora = this.item.HoraPulicacion;
    console.log(this.item.HoraPulicacion);
    this.item.HoraPulicacion = `${d.getHours()}:${d.getMinutes()}`;
    console.log(this.item);*/


    if(this.item.Id == 0)
      await this.apiForo.saveForo(this.item).toPromise();
    else
      await this.apiForo.updateForo(this.item).toPromise();
    
    //this.item.HoraPulicacion = tempHora;
    this.submitAttempt = false;
    
    console.log("guardado2");

    if(this.item.Id == 0) {
        const alertTerminado = await this.alertCtrl.create({
          header: 'Foro creado con éxito',
          backdropDismiss: false,
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
    } else {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Foro modificado con éxito',
        backdropDismiss: false,
        message: 'Se modificó el Foro ' + this.FrmItem.get('Nombre').value,
        buttons: [
          {
            text: 'Continuar', handler: () =>  this.modalCtrl.dismiss()
          }
        ]
      });
      await alertTerminado.present();
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
      options.push({text: x.Grado + x.Grupo , value: x.Grado+'/'+x.Grupo});
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
      options.push({text: x.Nombre , value: x.Id});
    });

    return options;
  }


  closeModal() {
    this.modalCtrl.dismiss();
  }
}
