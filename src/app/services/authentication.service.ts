import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../api/login.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private loginService: LoginService,
    private navCtrl: NavController
  ) {
    this.ifLoggedIn();
  }

  ifLoggedIn() {
    if (localStorage.getItem("USER_INFO") != null) {
      this.authState.next(true);
    }
  }

  async login(item) {
    try {
      
      const response = await this.loginService.login(item).toPromise();

      //if(response.hasOwnProperty("Status")) throw "Usuario o contraseña incorrectos";

      localStorage.setItem('USER_INFO',response["token"]);
      this.authState.next(true);
    }
    catch(err) {
      const error = err.status == 0 ? "Error con la conexión al servidor" : err.error;
      throw error;
    }
  }

  logout() {
    var promise = new Promise((resolve, reject) => {
      this.authState.next(false);
      localStorage.clear();
      //this.router.navigate(['login']);
      window.location.reload();
      resolve(this.authState.value);
    });

    return promise;
  }

  isAuthenticated() {
    console.log(this.authState.value);
    return this.authState.value;
  }
}
