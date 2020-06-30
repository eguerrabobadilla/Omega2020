import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  images = [
    'bandit',
    'batmobile',
    'blues-brothers',
    'bueller',
    'delorean',
    'eleanor',
    'general-lee',
    'ghostbusters',
    'knight-rider',
    'mirth-mobile'
  ];
  rotateImg = 0;
  items: any[] = [];
  lorem = 'Lorem iuis aute irure dol cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  constructor() {
    for (let i = 0; i < 20  ; i++) {
      this.items.push({
        // tslint:disable-next-line: no-use-before-declare
        index: i,
        name: i + ' - ' + this.images[this.rotateImg],
    //    imgSrc: getImgSrc(),
    //    avatarSrc: getImgSrc(),
        imgHeight: Math.floor(Math.random() * 50 + 150),
        // tslint:disable-next-line: no-use-before-declare
        content: this.lorem.substring(0, Math.random() * (this.lorem.length - 100) + 100)
      });
     
     }
  
  }
  ngOnInit() {
  
  

  }
}



