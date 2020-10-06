import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/api/usuarios.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  public user = {
    NombreCompleto : '',
    Grado  : '',
    Grupo : '',
    Escolaridad: '',
    GradoIngles: '',
    GrupoIngles: '',
    Usuario: '',
    Tipo:''
  };
  /*public user:any;*/

  constructor(private apiUsuarios: UsuariosService) { }

  ngOnInit() {
    const UsuarioId =this.getKeyToken('id');
    this.apiUsuarios.getUsuario(UsuarioId).subscribe(data => {
       this.user.NombreCompleto = data["NombreCompleto"];
       this.user.Grado = data["Grado"];
       this.user.Grupo = data["Grupo"];
       this.user.Escolaridad = data["Escolaridad"];
       this.user.GradoIngles = data["GradoIngles"];
       this.user.GrupoIngles = data["GrupoIngles"];
       this.user.Usuario = data["Usuario"];
       this.user.Tipo = data["Tipo"];
    });

    /*this.user.nombre = this.getKeyToken('nombre');
    this.user.grado = this.getKeyToken('grado');
    this.user.usuario = this.getKeyToken('usuario');*/
  }

  ionViewDidEnter() { 
    
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
