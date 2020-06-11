import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearChatPage } from './crear-chat.page';

/*const routes: Routes = [
  {
    path: '',
    component: CrearChatPage
  }
];
*/
@NgModule({
 // imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearChatPageRoutingModule {}
