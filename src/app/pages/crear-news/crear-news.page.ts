import { Component, OnInit, ChangeDetectorRef,Input,ViewChild } from '@angular/core';
import { ModalController, AlertController, ToastController, IonSelect, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { NewsService } from '../../api/news.service';

@Component({
  selector: 'app-crear-news',
  templateUrl: './crear-news.page.html',
  styleUrls: ['./crear-news.page.scss'],
})
export class CrearNewsPage implements OnInit {
  public FrmItem: FormGroup;
  public texto_adjuntar_portada: string = 'Foto de Portada';
  public submitAttempt: boolean = false;
  //private item: any;
  private files: any;
  titulo: any;
  tituloBoton: any;
  banderaEdito: boolean=false;

  @Input() item;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder, private cd:ChangeDetectorRef,
              private alertCtrl: AlertController,private apiNoticias: NewsService, private toastController: ToastController,
              private loadingController: LoadingController) {

      this.FrmItem = formBuilder.group({
        Id:   [0, Validators.compose([Validators.required])],
        Titulo: ['', Validators.compose([Validators.required])],
        Descripcion: ['', Validators.compose([Validators.required])],
        FechaPublicacion: ['', Validators.compose([Validators.required])],
        HoraPublicacion: ['', Validators.compose([Validators.required])],
        Visibilidad: ['', Validators.compose([Validators.required])],
        Escolaridad: [''],
        Image: [null, Validators.compose([Validators.required])]
      });

    }

  ngOnInit() {

  }

  ionViewWillEnter() {
    //console.log(this.item);
    if(this.item != undefined) {
      this.FrmItem.patchValue(this.item);

      let LstVisibilidad: any[] = [];
      let LstEscolaridad: any[] = [];

      //Directores y profesores no tienen escolaridad
      this.item.Noticiasvisibilidad.forEach(element => {
        if (!LstVisibilidad.includes(element.Visibilidad)) {
          LstVisibilidad.push(element.Visibilidad);
        }

        if(element.Visibilidad=='Alumno') {
          if (!LstEscolaridad.includes(element.Escolaridad)) {
            LstEscolaridad.push(element.Escolaridad);
          } 
        }
      });


      this.FrmItem.controls['Visibilidad'].setValue(LstVisibilidad);
      this.FrmItem.controls['Escolaridad'].setValue(LstEscolaridad);

      if(this.item.Image != undefined)
        this.texto_adjuntar_portada = 'Foto de Portada Seleccionada';

      this.titulo = 'Modificar Noticia';
      this.tituloBoton= 'Modificar Noticia';
    } else {
      this.titulo = 'Nueva Noticia';
      this.tituloBoton = 'Crear Noticia';
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

    console.log(this.FrmItem.value);
    this.item = this.FrmItem.value;

    let LstVisibilidad: any[] = [];

    if(this.item.Escolaridad == '' && this.item.Visibilidad.length==1 && this.item.Visibilidad[0]=="Alumno") {
      this.presentToast('Seleccione una escolaridad para poder continuar');
      return;
    }

    this.item.Visibilidad.forEach(element => {
      
      //Los profesores y directores no tienen escolaridad
      if(element=='Alumno') {

        this.item.Escolaridad.forEach(esco => {
          let newItem = {
            Visibilidad: '',
            Escolaridad: ''
          };

          newItem.Visibilidad = element;
          newItem.Escolaridad = esco;

          LstVisibilidad.push(newItem);
        });

      } else {
        let newItem = {
          Visibilidad: '',
        };

        newItem.Visibilidad = element;
        LstVisibilidad.push(newItem);

      }
    });
    
    console.log(this.item);
    const payload = new FormData();
    payload.append('Id', this.item.Id);
    payload.append('Titulo', this.item.Titulo);
    payload.append('Descripcion', this.item.Descripcion);
    payload.append('FechaPublicacion', this.item.FechaPublicacion.toString());
    payload.append('HoraPublicacion', this.item.HoraPublicacion);
    payload.append('Visibilidad', JSON.stringify(LstVisibilidad));
    if(this.files != undefined) //Valida si se selecciono alguna imagen
          payload.append('ImageUpload', this.files, this.files.name);
          
    console.log(payload);
    
    if(this.item.Id == 0) {
      const noticiaUpload = await this.apiNoticias.save(payload).toPromise();
    }
    else {
      const noticiaUpload =await this.apiNoticias.update(payload).toPromise();
    }

    this.banderaEdito=true;
    this.submitAttempt = false;

    this.loadingController.dismiss();

    if(this.item.Id == 0) {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Noticia creada con éxito',
        backdropDismiss: false,
        message: 'Se creó la noticia ' + this.FrmItem.get('Titulo').value + ', ¿desea crear otra notcia?',
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
        header: 'Noticia modificada con éxito',
        backdropDismiss: false,
        message: 'Se modificó la noticia ' + this.FrmItem.get('Titulo').value,
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
      color: 'dark',
      mode: 'ios',
      cssClass : 'toastCenter',
      duration: 3000
    });

    toast.present();
  }

  closeModal() {
    this.modalCtrl.dismiss({
      banderaEdito : this.banderaEdito
    });
  }


}
