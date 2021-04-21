import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplorerFilePage } from './explorer-file.page';

/*const routes: Routes = [
  {
    path: '',
    component: ExplorerFilePage
  }
];*/

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorerFilePageRoutingModule {}
