import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  FrmLogin: FormGroup;

  constructor(private authService: AuthenticationService, private fb: FormBuilder,
    private alertCtrl: AlertController,public loadingController: LoadingController,
    public alertController: AlertController,private router: Router,public webSocket: WebsocketService) { 
      this.FrmLogin = this.fb.group({
        Usuario: ['', [Validators.required]],
        Password: ['',[Validators.required]]
      });
    }

  ngOnInit() {

  }
  async loginUser(){
    let loading;
    try {
      if(this.FrmLogin.status === 'INVALID') return;

      let data=this.FrmLogin.value;

      loading = await this.loadingController.create({
        message: 'Validando...'
      });

      await loading.present();
      await this.authService.login(data);

      this.webSocket.initSocket();

      this.router.navigate(['home']);

      await this.loadingController.dismiss();

    }
    catch(err) {
        console.log(err);
        await this.loadingController.dismiss();

        const alert = await this.alertController.create({
          header: 'LBS Plus Demo',
          //subHeader: 'Subtitle',
          message: err,
          buttons: ['Aceptar']
        });
    
        await alert.present();
    }
  }

}
