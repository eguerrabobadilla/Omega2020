import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  public user = {
    nombre : '',
    grado  : '',
    usuario : ''
  };

  constructor() { }

  ngOnInit() {
    this.user.nombre = this.getKeyToken('nombre');
    this.user.grado = this.getKeyToken('grado');
    this.user.usuario = this.getKeyToken('usuario');
  }
  getKeyToken(key: string): string {

    const jwt = localStorage.getItem('USER_INFO');

    const jwtData = jwt.split('.')[1];
    // let decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtJsonData = decodeURIComponent(escape(window.atob(jwtData)));
    const decodedJwtData = JSON.parse(decodedJwtJsonData);

    const value = decodedJwtData[key];

    return value;
  }

}
