import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewResourcePage } from './new-resource.page';

/*const routes: Routes = [
  {
    path: '',
    component: NewResourcePage
  }
];*/

@NgModule({
 // imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewResourcePageRoutingModule {}
