import { Component, OnInit,Input } from '@angular/core';
import { ModalController,AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { LoginService } from 'src/app/api/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-alumno',
  templateUrl: './detalle-alumno.page.html',
  styleUrls: ['./detalle-alumno.page.scss'],
})
export class DetalleAlumnoPage implements OnInit {
  public FrmItem: FormGroup;
  @Input() item;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder,private alertCtrl: AlertController,
              private apiLogin: LoginService,private loadingController:LoadingController,private router: Router) { 
    this.FrmItem = formBuilder.group({
      Id:   [0, Validators.compose([Validators.required])],
      Nombre:   ['', Validators.compose([Validators.required])],
      ApellidoPaterno:   ['', Validators.compose([Validators.required])],
      ApellidoMaterno:   ['', Validators.compose([Validators.required])],
      Grupo:   ['', Validators.compose([Validators.required])],
      Usuario:   ['', Validators.compose([Validators.required])],
      Escolaridad:   ['', Validators.compose([Validators.required])],
      Password:   ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    if(this.item != undefined) {

      let escolaridad="";
      if(this.item.Escolaridad == 'Elementary School')
          escolaridad="Primaria"
      else if(this.item.Escolaridad == 'Junior High School')
          escolaridad="Secundaria"
      else if(this.item.Escolaridad == 'High School')
          escolaridad="Preparatoria"
      else if(this.item.Escolaridad == 'Kinder')
          escolaridad="Kinder"
      
      this.item.Escolaridad= escolaridad;
      this.FrmItem.patchValue(this.item);
      this.FrmItem.controls['Grupo'].setValue(this.item.Grado + this.item.Grupo);
    } else {
      //this.titulo = 'Nuevo Foro';
    }
  }

  async ingresar() {
    console.log("ingresar");
    let loading;
    try {

      loading = await this.loadingController.create({
        message: 'Validando...'
      });

      await loading.present();

      this.item = this.FrmItem.value;
      const token_temp = await this.apiLogin.loginTemp(this.item).toPromise();

      const jwt = localStorage.getItem('USER_INFO');
      localStorage.setItem('USER_INFO_TEMP',jwt);
      localStorage.setItem('USER_INFO',token_temp["token"]);

      await this.loadingController.dismiss();
      
      this.modalCtrl.dismiss();
      setTimeout(() => {
        this.router.navigate(['home']);
      }, 100);

    }
    catch(err) {
        console.log(err);
        await this.loadingController.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'LBS Plus Demo',
          //subHeader: 'Subtitle',
          message: err,
          buttons: ['Aceptar']
        });
    
        await alert.present();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
