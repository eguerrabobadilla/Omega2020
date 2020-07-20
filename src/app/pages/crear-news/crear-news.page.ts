import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
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
  private item: any;
  private files: any;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder, private cd:ChangeDetectorRef,
    private alertCtrl: AlertController,private apiNoticias: NewsService ) {

      this.FrmItem = formBuilder.group({
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
    payload.append('ImageUpload', this.files, this.files.name);

    const noticiaUpload = await this.apiNoticias.save(payload).toPromise();

    this.submitAttempt = false;

    const alertTerminado = await this.alertCtrl.create({
      header: 'Noticia creada con éxito',
      message: 'Se creó la noticia ' + this.FrmItem.get('Titulo').value + ', ¿desea crear otra notcia?',
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

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
