import {NgModule} from '@angular/core';
import { PillMenuComponent } from '../components/pill-menu/pill-menu.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CircleProgressComponent } from '../components/circle-progress/circle-progress.component';
import { CodesComponent } from '../components/codes/codes.component';
import { FormsModule } from '@angular/forms';
import { BooksComponent } from '../components/books/books.component';
import { FilterPipe } from '../pipes/filter.pipe';
import { CircleProgressReportComponent } from '../components/circle-progress-report/circle-progress-report.component';
import { ChatsComponent } from '../components/chats/chats.component';
import { NewsComponent } from '../components/news/news.component';
import { LinkifyPipe } from '../pipes/linkifypipe ';
import { SortByPipe } from '../pipes/sort-by.pipe';
import { SanitizePipe } from '../pipes/sanitize.pipe';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule
    ],
    declarations:[PillMenuComponent,CircleProgressComponent,CodesComponent,BooksComponent,FilterPipe,CircleProgressReportComponent,ChatsComponent,NewsComponent,LinkifyPipe,SortByPipe,SanitizePipe],
    exports:[PillMenuComponent,CircleProgressComponent,CodesComponent,BooksComponent,FilterPipe,CircleProgressReportComponent,ChatsComponent,NewsComponent,LinkifyPipe,SortByPipe,SanitizePipe]
})
export class GlobalModule
{

}