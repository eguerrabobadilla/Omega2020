import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearNewsPage } from './crear-news.page';

/*const routes: Routes = [
  {
    path: '',
    component: CrearNewsPage
  }
];*/

@NgModule({
 // imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearNewsPageRoutingModule {}
