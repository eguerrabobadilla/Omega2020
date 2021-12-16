import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, Input, ApplicationRef, ContentChild } from '@angular/core';
import { ModalController, AlertController, PickerController, IonInput, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
//page
import { BibliotecaPage } from '../pages/biblioteca/biblioteca.page';
import { MostrarArchivosComponent } from '../components/biblioteca/mostrar-archivos/mostrar-archivos.component';
import { RecursosService } from '../api/recursos.service';
import { ChatService } from '../api/chat.service';
import { MateriasService } from '../api/materias.service';
import { BibliotecaService } from '../api/biblioteca.service';

@Component({
  selector: 'app-new-resource',
  templateUrl: './new-resource.page.html',
  styleUrls: ['./new-resource.page.scss'],
})
export class NewResourcePage implements OnInit {
  @ViewChild('txtGradoGrupo', {static: false}) txtGradoGrupo: IonInput;
  @ViewChild('txtGradoGrupo', {read: ElementRef, static: true}) txtGradoGrupoHTML: ElementRef;
  @ViewChild('txtMateria', {static: false}) txtMateria: IonInput;
  @ViewChild('txtTipo', {static: false}) txtTipo: IonInput;
  @ViewChild('txtMateria', {read: ElementRef, static: true}) txtMateriaHTML: ElementRef;
  @ViewChild('txtFecha', {static: false}) txtFecha: IonInput;
  @ViewChild('txtFecha', {read: ElementRef, static: false}) txtFechaHTML: ElementRef;
  @ViewChild('inputFilePortada', {static: false}) inputFilePortada: ElementRef;
  @ViewChild('btnAbrirBiblioteca', {static: false}) btnAbrirBiblioteca: ElementRef;
  public FrmItem: FormGroup;
  public  texto_adjuntar_portada: string = 'Adjuntar Recurso';
  public submitAttempt: boolean = false;
  //private item: any;
  private files: any;
  meses: string[];
  descripcion: string;
  semanas: string[];
  tipos: string[];
  mesSeleccionado: any;
  semanaSeleccionada: any;
  grupos: any[] = [];
  materias: any[] = [];
  gradoSeleccionado: any;
  grupoSeleccionado: any;
  MateriaSeleccionada: any;
  TipoSeleccionada: any;
  @Input() TipoRecurso:any;
  EscolaridadSeleccionada: any;
  titulo: any;
  tituloBoton: any;
  @Input() item;
  banderaEdito: boolean = false;
  GrupoIngles: any;

  //Biblioteca vars
  listaArchivosBiblioteca: any[] = [];
  esBibliotecaEditar: boolean = false;
  mesAux: string;
  semanaAux: string;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private cd: ChangeDetectorRef,
              private alertCtrl: AlertController, private apiRecursos: RecursosService, private pickerController: PickerController,
              private renderer: Renderer2, private apiChat: ChatService, private apiMaterias: MateriasService, public loadingController: LoadingController,
              public toastController: ToastController, private changeDetector : ChangeDetectorRef, private applicationRef: ApplicationRef,
			  private bibliotecaService: BibliotecaService) {
    this.FrmItem = formBuilder.group({
      Id:   [0, Validators.compose([Validators.required])],
      Grupo:   ['', Validators.compose([Validators.required])],
      MateriaId:   ['', Validators.compose([Validators.required])],
      Tipo   : ['', Validators.compose([Validators.required])],
      Titulo: ['', Validators.compose([Validators.required])],
      Descripcion: ['', Validators.compose([Validators.required])],
      FechaPublicacion: [''],
      FechaPublicacionClaseVirtual:  [''],
      Image: [null, Validators.compose([])]
    });
  }

  ngOnInit() {
    this.meses   = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
    this.semanas = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    this.tipos = ['Mi dispositivo', 'Clase Virtual', 'Video', 'Imagen', 'Audio', 'Mapa'];
  }

  ionViewWillEnter() {
    
    if (this.item != undefined) {
		console.log("aqui will ", this.item);
      this.FrmItem.patchValue(this.item);
      
      this.gradoSeleccionado = this.item.Grado;
      this.grupoSeleccionado = this.item.Grupo;
      this.EscolaridadSeleccionada = this.item.Escolaridad
      if (this.item.GrupoIngles == 'NO') {
        this.txtGradoGrupo.value = this.item.Grado + this.item.Grupo + ' ' + this.item.Escolaridad;
      }
      else {
        this.txtGradoGrupo.value = 'Level ' + this.item.Grado  + this.item.Grupo + ' ' + this.item.Escolaridad;
      }


      this.txtMateria.value = this.item.Materia.Nombre;
      this.txtTipo.value = this.item.Tipo == 'Zoom' ? 'Clase Virtual' : 'Archivo';
      this.TipoSeleccionada = this.item.Tipo == 'Zoom' ? 'Clase Virtual' : 'Archivo';
      this.descripcion = this.item.Tipo == 'Zoom' ? 'Enlace' : 'Descripción';
      this.changeDetector.detectChanges();
      this.FrmItem.controls['FechaPublicacionClaseVirtual'].setValue(this.item.Fecha);
      this.MateriaSeleccionada = this.item.MateriaId;
      this.GrupoIngles = this.item.GrupoIngles;

      this.semanaSeleccionada = this.item.Semana;
      this.mesSeleccionado = this.item.Mes;
      setTimeout(() => {
        this.txtFecha.value = this.item.Mes + ' / ' + this.item.Semana;
      }, 150); 

      if (this.item.PathRecurso != undefined) {
        this.texto_adjuntar_portada = 'Recurso Seleccionado';
      }
	  if(this.item.Recursosdetalles.length > 0) {
		this.listaArchivosBiblioteca = this.item.Recursosdetalles;
		this.txtTipo.value = this.item.Tipo;
		this.mesAux = this.item.Mes;
		this.semanaAux = this.item.Semana;
		this.esBibliotecaEditar = true;
	  }

      this.titulo = 'Modificar Recursos';
      this.tituloBoton = 'Modificar Recurso';
    } else {
      this.titulo = 'Nuevo Recurso';
      this.tituloBoton = 'Crear Recurso';
      this.txtTipo.value = this.TipoRecurso;
      this.descripcion = this.TipoRecurso == 'Clase Virtual' ? 'Enlace' : 'Descripción';
      this.TipoSeleccionada = this.TipoRecurso;
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
      columns: [{
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

   if (month == 1) { month = 5; }
   else if (month == 2) { month = 6; }
   else if (month == 3) { month = 7; }
   else if (month == 4) { month = 8; }
   else if (month == 5) { month = 9; }
   else if (month == 6) { month = 10; }
   else if (month == 7) { month = 11; }
   else if (month == 8) { month = 0; }
   else if (month == 9) { month = 1; }
   else if (month == 10) { month = 2; }
   else if (month == 11) { month = 3; }


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

  getColumnOptionsTipo() {
    let options = [];

    this.tipos.forEach(x => {
      options.push({text: x , value: x});
    });

    return options;
  }

  async crearNoticia() {

	console.log("frmItem", this.FrmItem);
	console.log("item", this.item);
	console.log("item", this.MateriaSeleccionada);

    this.submitAttempt = true;
    if (this.FrmItem.controls['Tipo'].value == 'Clase Virtual'){
        if(this.FrmItem.controls['FechaPublicacionClaseVirtual'].value==""){

          const alert = await  this.alertCtrl.create({
            header: 'Elegir la fecha',
            subHeader: 'Favor de elegir la fecha de la clase virtual.',
            mode: 'ios',
            buttons: ['Aceptar']
          });
    
          await alert.present();
          return;
          
        }
     const descripcion = this.FrmItem.controls['Descripcion'].value
     if (!((descripcion.toLowerCase().includes('https://') || descripcion.toLowerCase().includes('http://')) && descripcion.toLowerCase().includes('zoom.us'))) {


        const alert = await  this.alertCtrl.create({
          header: 'Link no valido',
          subHeader: 'Este no es un enlace valido de zoom.',
          mode: 'ios',
          buttons: ['Aceptar']
        });
  
        await alert.present();
        return;
      }
    }
    if (this.FrmItem.controls['Tipo'].value != 'Zoom'){
      if(this.FrmItem.controls['FechaPublicacion'].value==""){

        const alert = await  this.alertCtrl.create({
          header: 'Elegir la fecha',
          subHeader: 'Favor de elegir la fecha del archivo.',
          mode: 'ios',
          buttons: ['Aceptar']
        });
  
        await alert.present();
        return;
        
      }
   const descripcion = this.FrmItem.controls['Descripcion'].value
   if (((descripcion.toLowerCase().includes('https://') || descripcion.toLowerCase().includes('http://')) && descripcion.toLowerCase().includes('zoom.us')) ){


      const alert = await  this.alertCtrl.create({
        header: 'Esto es un link',
        subHeader: 'Para agregar un link elige la opción clase virtual en este formulario .',
        mode: 'ios',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }
  }
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

    console.log(this.item);
	let bibliotecaSendData: any;
	let payload: any;

	if(this.item.Tipo === 'Mi dispositivo' || this.item.Tipo === 'Clase Virtual' || this.item.Tipo === 'Archivo') {
		payload = new FormData();
		payload.append('Id', this.item.Id);
		payload.append('Titulo', this.item.Titulo);
		payload.append('Tipo', this.item.Tipo);
		payload.append('Descripcion', this.item.Descripcion);
		payload.append('Ano', '2020');
		if (this.item.FechaPublicacionClaseVirtual != undefined) payload.append('Fecha', this.item.FechaPublicacionClaseVirtual);
		if (this.mesSeleccionado != undefined) payload.append('Mes', this.mesSeleccionado);
		if (this.semanaSeleccionada != undefined) payload.append('Semana', this.semanaSeleccionada);
		payload.append('MateriaId', this.MateriaSeleccionada);
		payload.append('Grado', this.gradoSeleccionado);
		payload.append('Grupo', this.grupoSeleccionado);
		payload.append('GrupoIngles', this.GrupoIngles);
		//payload.append('ItemUpload', this.files, this.files.name);
		if (this.files != undefined) { //Valida si se selecciono alguna imagen
			payload.append('ItemUpload', this.files, this.files.name);
		}
	} else {
		bibliotecaSendData = {
			"Id": this.item.Id,
			"Titulo": this.item.Titulo,
			"Tipo": this.item.Tipo,
			"Descripcion":this.item.Descripcion,
			"Ano": "2020",
			"Mes": this.mesSeleccionado != undefined ? this.mesSeleccionado : undefined,
			"Semana": this.semanaSeleccionada != undefined ? this.semanaSeleccionada : undefined,
			"MateriaId": this.MateriaSeleccionada,
			"Grado": this.gradoSeleccionado,
			"Grupo": this.grupoSeleccionado,
			"GrupoIngles": this.GrupoIngles,
			"RecursosDetalles" : this.listaArchivosBiblioteca
		};
	}

	console.log({bibliotecaSendData});
	console.log({payload})

    if (this.item.Id == 0) {
		if(this.item.Tipo !== 'Mi dispositivo' && this.item.Tipo !== 'Clase Virtual') {
			await this.bibliotecaService.addBibliotecaRecurso(bibliotecaSendData).toPromise();
		}else {
			await this.apiRecursos.save(payload).toPromise();
		}
    }
    else {
		if(this.esBibliotecaEditar) {

			for(let i = 0 ; i < this.listaArchivosBiblioteca.length ; i++) {
				if(!('RecursoId' in this.listaArchivosBiblioteca)) {
					delete this.listaArchivosBiblioteca[i].Id;
				}
			}
			console.log("mes", this.mesSeleccionado);
			console.log("semana", this.semanaSeleccionada);

			bibliotecaSendData.Semana = this.semanaSeleccionada == undefined ? this.semanaAux : this.semanaSeleccionada;
			bibliotecaSendData.Mes = this.mesSeleccionado == undefined ? this.mesAux: this.mesSeleccionado;

			await this.bibliotecaService.editBibliotecaRecurso(bibliotecaSendData).toPromise();
		} else if(!this.esBibliotecaEditar) {
			await this.apiRecursos.update(payload).toPromise();
		}
    }

    this.banderaEdito = true;
    this.submitAttempt = false;

    this.loadingController.dismiss();

    if (this.item.Id == 0) {
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
    if ( $event.target.files &&  $event.target.files.length) {
      const re = new RegExp('(application|text)\/(x-msdownload|javascript|x-pkcs12|html)', 'g');   

      //No se permite subir archivo con extesione exe;
      if (re.test($event.target.files[0].type) == true) {
        this.presentToast('No se permite subir este tipo de archivo');
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
      color: 'dark',
      mode: 'ios',
      cssClass : 'toastCenter',
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
                const gradoGrupo = value.Grupos.value.split('/');
                //this.txtGradoGrupo.value = gradoGrupo[0] + ' / ' + gradoGrupo[1];
                this.txtGradoGrupo.value = value.Grupos.text;
                this.gradoSeleccionado = gradoGrupo[0];
                this.grupoSeleccionado = gradoGrupo[1];
                this.EscolaridadSeleccionada = gradoGrupo[2];
                this.GrupoIngles = gradoGrupo[3];

                this.txtMateria.value = '';
                this.MateriaSeleccionada = '';
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
      if (x.GrupoIngles == 'NO') {
        options.push({text: x.Grado + x.Grupo + ' ' + x.Escolaridad, value: x.Grado + '/' + x.Grupo + '/' + x.Escolaridad + '/' + x.GrupoIngles});
        //this.GrupoIngles="NO"
      }
      else {
        options.push({text: 'Level ' + x.Grado + x.Grupo + ' ' + x.Escolaridad, value: x.Grado + '/' + x.Grupo + '/' + x.Escolaridad + '/' + x.GrupoIngles});
        //this.GrupoIngles="SI"
      }
    });

    return options;
  }

  async openPickerMaterias() {
    let picker = await this.pickerController.create({
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
  
picker.columns[0].options.map(element =>{
 
  delete element.selected;
  delete element.duration;
  delete element.transform;
  console.log(element)
})


    setTimeout(() => {
       picker.present();
      console.log(picker.columns)
     
    }, 1000);
    

  }



  async openPickerTipo() {
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
              console.log('value');
              console.log(value);
              this.txtTipo.value = value.Tipo.text;
              this.TipoSeleccionada = value.Tipo.text;
              this.semanaSeleccionada = undefined;
              this.mesSeleccionado = undefined;
              this.descripcion = value.Tipo.text == 'Clase Virtual' ? 'Enlace' : 'Descripción';

              this.files = undefined;

			  if(value.Tipo.text == 'Mi dispositivo'){
				  this.inputFilePortada.nativeElement.click();
			  }
			  if(value.Tipo.text != 'Clase Virtual' && value.Tipo.text != 'Mi dispositivo') {
				this.testAbrirBiblioteca(value.Tipo.text);
			  }
            }
          }
        ],
        columns: [{
            name: 'Tipo',
            options: this.getColumnOptionsTipo()
          }
        ]
    });
    
    picker.present();

  }

  async openPickerSelectArchivo() {
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
				if(value.Ubicación.value == "0") {
					this.inputFilePortada.nativeElement.click();
				}
				if(value.Ubicación.value == "1") {
					/* this.btnAbrirBiblioteca.nativeElement.click(); */
					//this.testAbrirBiblioteca();
				}
            }
          }
        ],
        columns: [{
            name: 'Ubicación',
            options: [ {
				text: 'Mi Dispositivo',
				value: '0'
			},{
				text: 'Biblioteca',
				value: '1'
			}
		]
			
			
          }
        ]
    });
    
    picker.present();
  }

  async getColumnMaterias() {
    const options = [];

    this.grupos = await this.apiMaterias.getMateriasProfesor(this.EscolaridadSeleccionada, this.gradoSeleccionado, this.grupoSeleccionado, this.GrupoIngles).toPromise();

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


  async testAbrirBiblioteca(tipoArchivo: string) {
    const modal = await this.modalCtrl.create({
      component: MostrarArchivosComponent,
      cssClass: 'my-custom-modal-css',
      showBackdrop: false,
      mode: 'ios',
      backdropDismiss: true,
	  componentProps: {
		datosArchivos: tipoArchivo,
		mostrarBtnAdjuntar: true
	  }
    });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
		if(data.data.length > 0) {
			if(this.listaArchivosBiblioteca.length > 0)  {
				for(let i = 0 ; i < data.data.length ; i++) {
					for(let j = 0 ; j < this.listaArchivosBiblioteca.length ; j++) {
						if(this.listaArchivosBiblioteca[j].PathRecurso !== data.data[i].PathRecurso) {
							this.listaArchivosBiblioteca.push(data.data[i]);
						}
					}
				}

				this.listaArchivosBiblioteca = [...new Map(this.listaArchivosBiblioteca.slice().reverse().map(v => 
					[v.PathRecurso, v]
				)).values()].reverse();
			} else {
				this.listaArchivosBiblioteca = data.data;
			}
				
		}
    });
  }


  async deleteArchivoAdjuntar(idArchivo) {
	  const alert = await this.alertCtrl.create({
		cssClass: 'alert-container',
		mode: "ios",
		message: '¿Eliminar este archivo de la lista?',
		buttons: [
		  {
			text: 'Cancelar',
			role: 'cancel',
			cssClass: 'secondary',
			handler: (msg) => {
			  console.log('Confirm Cancel: regresar');
			}
		  }, {
			text: 'Aceptar',
			handler: (msg) => {
				this.listaArchivosBiblioteca = this.listaArchivosBiblioteca.filter((archivo) => archivo.Id !== idArchivo);
			}
		  }
		]
	  });
  
	  await alert.present();
  }

}
