import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleChatGroupPage } from './detalle-chat-group.page';

/*const routes: Routes = [
  {
    path: '',
    component: DetalleChatGroupPage
  }
];*/

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleChatGroupPageRoutingModule {}
