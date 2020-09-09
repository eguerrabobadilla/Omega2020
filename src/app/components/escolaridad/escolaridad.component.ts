import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-escolaridad',
  templateUrl: './escolaridad.component.html',
  styleUrls: ['./escolaridad.component.scss'],
})
export class EscolaridadComponent implements OnInit {
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
