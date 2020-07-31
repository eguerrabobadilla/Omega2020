import { Component, OnInit, ChangeDetectorRef, Renderer2,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController, PickerController,IonInput } from '@ionic/angular';
import { ChatService } from 'src/app/api/chat.service';
import { MateriasService } from 'src/app/api/materias.service';
import { TemasService } from 'src/app/api/temas.service';

@Component({
  selector: 'app-crear-topic',
  templateUrl: './crear-topic.page.html',
  styleUrls: ['./crear-topic.page.scss'],
})
export class CrearTopicPage implements OnInit {
  @ViewChild('txtGradoGrupo', {static: false}) txtGradoGrupo: IonInput;
  @ViewChild('txtGradoGrupo', {read: ElementRef, static: true}) txtGradoGrupoHTML: ElementRef;
  @ViewChild('txtMateria', {static: false}) txtMateria: IonInput;
  @ViewChild('txtMateria', {read: ElementRef, static: true}) txtMateriaHTML: ElementRef;
  public FrmItem: FormGroup;
  public  texto_adjuntar_portada: string = 'Adjuntar Tema';
  public submitAttempt: boolean = false;
  private item: any;
  private files: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder,private cd:ChangeDetectorRef,
              private alertCtrl: AlertController,private pickerController: PickerController,private renderer: Renderer2,
              private apiChat: ChatService,private apiMaterias: MateriasService,private apiTemas: TemasService) { 
          this.FrmItem = formBuilder.group({
            Grupo:   ['', Validators.compose([Validators.required])],
            MateriaId:   ['', Validators.compose([Validators.required])],
            Titulo: ['', Validators.compose([Validators.required])],
            FechaPublicacion:['', Validators.compose([Validators.required])]
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
    this.item.MateriaId= this.MateriaSeleccionada;
    this.item.Grado = this.gradoSeleccionado;
    this.item.Grupo = this.grupoSeleccionado;


    const temasWS = await this.apiTemas.save(this.item).toPromise();

    this.submitAttempt = false;

    const alertTerminado = await this.alertCtrl.create({
      header: 'Tema creado con éxito',
      message: 'Se creó el recurso ' + this.FrmItem.get('Titulo').value + ', ¿desea crear otro tema?',
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

    this.grupos = await this.apiMaterias.getMateriasProfesor().toPromise();

    this.grupos.forEach(x => {
      options.push({text: x.nombre , value: x.id});
    });

    return options;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
  
}
