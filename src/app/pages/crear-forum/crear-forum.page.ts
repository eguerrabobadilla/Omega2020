import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { ForumService } from '../../api/forum.service';

@Component({
  selector: 'app-crear-forum',
  templateUrl: './crear-forum.page.html',
  styleUrls: ['./crear-forum.page.scss'],
})
export class CrearForumPage implements OnInit {
  public FrmItem: FormGroup;
  public submitAttempt: boolean = false;
  private item: any;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder,private alertCtrl: AlertController,
              private apiForo: ForumService) {
    this.FrmItem = formBuilder.group({
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

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
