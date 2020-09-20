import {NgModule} from '@angular/core';
import { PillMenuComponent } from '../components/pill-menu/pill-menu.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CircleProgressComponent } from '../components/circle-progress/circle-progress.component';
import { CodesComponent } from '../components/codes/codes.component';
import { FormsModule } from '@angular/forms';
import { BooksComponent } from '../components/books/books.component';
import { FilterPipe } from '../pipes/filter.pipe';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule
    ],
    declarations:[PillMenuComponent,CircleProgressComponent,CodesComponent,BooksComponent,FilterPipe],
    exports:[PillMenuComponent,CircleProgressComponent,CodesComponent,BooksComponent,FilterPipe]
})
export class GlobalModule
{

}