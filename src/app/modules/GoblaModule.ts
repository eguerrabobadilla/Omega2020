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
import { MensajeAdeudoComponent } from '../components/mensaje-adeudo/mensaje-adeudo.component';
import { MensajeInternetComponent } from '../components/mensaje-internet/mensaje-internet.component';
import { ListResourceComponent } from '../components/list-resource/list-resource.component';
import { ForumComponent } from '../components/forum/forum.component';
import { GraphicsComponent } from '../components/graphics/graphics.component';
import { EvidencesComponent } from '../components/evidences/evidences.component';
import { SubjectsComponent } from '../components/subjects/subjects.component';
import { QuestionsComponent } from '../components/questions/questions.component';
import { ContactComponent } from '../components/contact/contact.component';
import { PerfilComponent } from '../components/perfil/perfil.component';
import { ReportComponent } from '../components/report/report.component';
import { ListExamenesComponent } from '../components/list-examenes/list-examenes.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule
    ],
    declarations:[PillMenuComponent,CircleProgressComponent,CodesComponent,BooksComponent,FilterPipe,CircleProgressReportComponent,ChatsComponent,NewsComponent,LinkifyPipe,SortByPipe,SanitizePipe,MensajeAdeudoComponent,MensajeInternetComponent,ListResourceComponent,
                  ForumComponent,GraphicsComponent,EvidencesComponent,SubjectsComponent,QuestionsComponent,ContactComponent,
                  PerfilComponent,ReportComponent,ListExamenesComponent],
    exports:[PillMenuComponent,CircleProgressComponent,CodesComponent,BooksComponent,FilterPipe,CircleProgressReportComponent,ChatsComponent,NewsComponent,LinkifyPipe,SortByPipe,SanitizePipe,MensajeAdeudoComponent,MensajeInternetComponent,ListResourceComponent,
             ForumComponent,GraphicsComponent,EvidencesComponent,SubjectsComponent,QuestionsComponent,ContactComponent,
             PerfilComponent,ReportComponent,ListExamenesComponent ]
})
export class GlobalModule
{

}