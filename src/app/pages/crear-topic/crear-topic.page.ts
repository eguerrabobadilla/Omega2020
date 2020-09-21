import { Component, OnInit, ChangeDetectorRef, Renderer2,ViewChild,ElementRef,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController, PickerController,IonInput, LoadingController } from '@ionic/angular';
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
  //private item: any;
  private files: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;
  EscolaridadSeleccionada:any;
  titulo: any;
  evento: any;
  loading: any;

  @Input() item;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder,private cd:ChangeDetectorRef,
              private alertCtrl: AlertController,private pickerController: PickerController,private renderer: Renderer2,
              private apiChat: ChatService,private apiMaterias: MateriasService,private apiTemas: TemasService,
              public loadingController: LoadingController) { 
          this.FrmItem = formBuilder.group({
            Id:   [0, Validators.compose([Validators.required])],
            Grupo:   ['', Validators.compose([Validators.required])],
            MateriaId:   ['', Validators.compose([Validators.required])],
            Titulo: ['', Validators.compose([Validators.required])],
            FechaPublicacion:['', Validators.compose([Validators.required])]
          });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    if(this.item != undefined) {

      //El recursoId sale de la tabla calendario
      this.apiTemas.get(this.item.RecursoId).subscribe(data => {
        this.FrmItem.patchValue(data);
      
        this.gradoSeleccionado = this.item.Grado;
        this.grupoSeleccionado = this.item.Grupo;
        this.EscolaridadSeleccionada = this.item.Escolaridad
        this.txtGradoGrupo.value = this.item.Grado + ' / ' + this.item.Grupo + " " + this.item.Escolaridad;
  
        this.txtMateria.value = this.item.Materia.Nombre;
        this.MateriaSeleccionada = this.item.MateriaId;
  
        this.titulo = 'Modificar Tema';
      });
    } else {
      this.titulo = 'Crear Tema';
    }
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

    //console.log(this.FrmItem.value);
    this.item = this.FrmItem.value;
    this.item.MateriaId= this.MateriaSeleccionada;
    this.item.Grado = this.gradoSeleccionado;
    this.item.Grupo = this.grupoSeleccionado;


    //const temasWS = await this.apiTemas.save(this.item).toPromise();9
    if(this.item.Id == 0)
      await await this.apiTemas.save(this.item).toPromise();
    else
      this.evento = await this.apiTemas.update(this.item).toPromise();

    //console.log(this.evento);

    this.submitAttempt = false;

    this.loadingController.dismiss();

    if(this.item.Id == 0) {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Tema creado con éxito',
        backdropDismiss: false,
        message: 'Se creó el recurso ' + this.FrmItem.get('Titulo').value + ', ¿desea crear otro tema?',
        buttons: [
          {
            text: 'No', handler: () =>  this.modalCtrl.dismiss()
          },
          {
            text: 'Crear otro', handler: () => { 
              this.FrmItem.reset();
              this.FrmItem.controls['Id'].setValue(0);
            }
          }
        ]
      });

      await alertTerminado.present();
    } else {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Tema modificado con éxito',
        backdropDismiss: false,
        message: 'Se modificó el Tema ' + this.FrmItem.get('Titulo').value,
        buttons: [
          {
            text: 'Continuar', handler: () =>  this.modalCtrl.dismiss(this.evento)
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
              console.log(value);
                const gradoGrupo = value.Grupos.value.split("/");
                //this.txtGradoGrupo.value = gradoGrupo[0] + ' / ' + gradoGrupo[1];
                this.txtGradoGrupo.value = value.Grupos.text
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
    //console.log(this.grupos);
    
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
    this.modalCtrl.dismiss();
  }
  
}
