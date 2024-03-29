import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PillMenuComponent } from '../../components/pill-menu/pill-menu.component';
import { HomeDirectorPage } from './home-director.page';
import { DetallePage } from '../../detalle/detalle.page';
import { DetallePageModule } from '../../detalle/detalle.module';
import { NuevoRecursoPage } from '../../nuevo-recurso/nuevo-recurso.page';
import { NuevoRecursoPageModule } from '../../nuevo-recurso/nuevo-recurso.module';
import { BooksComponent } from '../../components/books/books.component';
import { CodesComponent } from '../../components/codes/codes.component';
import { ListComponent } from '../../components/list/list.component';
import { CrearForumPageModule } from '../../pages/crear-forum/crear-forum.module';
import { CrearForumPage } from '../../pages/crear-forum/crear-forum.page';
import { DetallesChatPage } from '../../pages/detalles-chat/detalles-chat.page';
import { DetallesChatPageModule } from '../../pages/detalles-chat/detalles-chat.module';
import { CrearChatPageModule } from '../../pages/crear-chat/crear-chat.module';
import { CrearChatPage } from '../../pages/crear-chat/crear-chat.page';
import { FilterPipe } from '../../pipes/filter.pipe';
import { NewResourcePage } from '../../new-resource/new-resource.page';
import { NewResourcePageModule } from '../../new-resource/new-resource.module';
import { CrearNewsPageModule } from '../../pages/crear-news/crear-news.module';
import { CrearNewsPage } from '../../pages/crear-news/crear-news.page';
import { DetalleChatGroupPage } from '../../pages/detalle-chat-group/detalle-chat-group.page';
import { DetalleChatGroupPageModule } from '../../pages/detalle-chat-group/detalle-chat-group.module';
import { GraphicsComponent } from '../../components/graphics/graphics.component';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { CalendarEventsPage } from '../../pages/calendar-events/calendar-events.page';
import { CalendarEventsPageModule } from '../../pages/calendar-events/calendar-events.module';
import { CrearEvidencePage } from '../../pages/crear-evidence/crear-evidence.page';
import { CrearEvidencePageModule } from '../../pages/crear-evidence/crear-evidence.module';
import { CrearTopicPage } from '../../pages/crear-topic/crear-topic.page';
import { CrearTopicPageModule } from '../../pages/crear-topic/crear-topic.module';
import { CircleProgressComponent } from '../../components/circle-progress/circle-progress.component';
import { EscolaridadComponent } from 'src/app/components/escolaridad/escolaridad.component';
import { GruposComponent } from 'src/app/components/grupos/grupos.component';
import { AlumnosComponent } from 'src/app/components/alumnos/alumnos.component';
import { HomePageModule } from 'src/app/home/home.module';
import { GlobalModule } from 'src/app/modules/GoblaModule';
import { DetalleAlumnoPage } from '../detalle-alumno/detalle-alumno.page';
import { DetalleAlumnoPageModule } from '../detalle-alumno/detalle-alumno.module';
import { EscolaridadDocentesComponent } from 'src/app/components/escolaridad-docentes/escolaridad-docentes.component';
import { GruposDocentesComponent } from 'src/app/components/grupos-docentes/grupos-docentes.component';
import { DocentesComponent } from 'src/app/components/docentes/docentes.component';
import { BuscarUsuariosComponent } from 'src/app/components/buscar-usuarios/buscar-usuarios.component';


@NgModule({
  entryComponents : [
    DetallePage,
    CrearForumPage,
    CrearChatPage,
    CrearNewsPage,
    NuevoRecursoPage,
    DetallesChatPage,
    DetalleChatGroupPage,
    NewResourcePage,
    CalendarEventsPage,
    CrearEvidencePage,
    CrearTopicPage,
    EscolaridadComponent,
    GruposComponent,
    AlumnosComponent,
    DetalleAlumnoPage,
    EscolaridadDocentesComponent,
    GruposDocentesComponent,
    DocentesComponent,
    BuscarUsuariosComponent
  ],
  imports: [ 
    MbscModule,  
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeDirectorPage
      }
    ]),
    DetallePageModule,
    NuevoRecursoPageModule,
    CrearForumPageModule,
    CrearChatPageModule,
    DetallesChatPageModule,
    DetalleChatGroupPageModule,
    NewResourcePageModule,
    CrearNewsPageModule,
    CalendarEventsPageModule,
    CrearEvidencePageModule,
    CrearTopicPageModule,
    DetalleAlumnoPageModule,
    GlobalModule,
  ],
  declarations: [HomeDirectorPage,EscolaridadComponent,GruposComponent,AlumnosComponent,
                  EscolaridadDocentesComponent,GruposDocentesComponent,DocentesComponent,
                  BuscarUsuariosComponent]
})
export class HomeDirectorPageModule {}
