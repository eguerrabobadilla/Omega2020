import { Component, OnInit } from '@angular/core';
import { MateriasService } from 'src/app/api/materias.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  LstMaterias: any[] = [];
  public user = {
    grupo : '',
    grado  : '',
    tipo   :'',
    escolaridad: ''
  };

  constructor(private apiMaterias: MateriasService) { }

  ngOnInit() {
    this.user.grupo = this.getKeyToken('grupo');
    this.user.grado = this.getKeyToken('grado');
    this.user.tipo  = this.getKeyToken('tipo');
    this.user.escolaridad  = this.getKeyToken('escolaridad');

    this.apiMaterias.get().subscribe(data => {
      this.LstMaterias = data;
    });

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
