import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearTopicPage } from './crear-topic.page';

/*const routes: Routes = [
  {
    path: '',
    component: CrearTopicPage
  }
];*/

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearTopicPageRoutingModule {}
