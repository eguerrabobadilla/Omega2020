import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  

  items: any[] = [];
  numerovueltas: number;
  vueltas:any[] = [];
  @Input() public onClick = (number) => {};

  constructor() {
    
  
  }
  ngOnInit() {
    this.vueltas = Array(this.numerovueltas).fill(1).map((x,i)=>i);

  }

 async afterClick(number) {
    this.onClick(number+1);
  }

}



