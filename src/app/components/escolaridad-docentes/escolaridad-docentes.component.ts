import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-escolaridad-docentes',
  templateUrl: './escolaridad-docentes.component.html',
  styleUrls: ['./escolaridad-docentes.component.scss'],
})
export class EscolaridadDocentesComponent implements OnInit {
  @Output() detail = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  openDetail(index,escolaridad) {
    let item = {
      index: index,
      escolaridad: escolaridad
    };

    setTimeout(() => {
      this.detail.emit(item);
    }, 200);
  }

}
