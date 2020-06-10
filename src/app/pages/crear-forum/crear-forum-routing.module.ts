import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearForumPage } from './crear-forum.page';

/*const routes: Routes = [
  {
    path: '',
    component: CrearForumPage
  }
];*/

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearForumPageRoutingModule {}
