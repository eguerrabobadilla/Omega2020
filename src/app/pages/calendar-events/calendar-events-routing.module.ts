import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarEventsPage } from './calendar-events.page';

/*const routes: Routes = [
  {
    path: '',
    component: CalendarEventsPage
  }
];*/

@NgModule({
 // imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarEventsPageRoutingModule {}
