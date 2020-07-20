import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
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
 /*imports: [ 
    FormsModule,  
    MbscModule, RouterModule.forChild(routes)],*/
  exports: [RouterModule],
})
export class NewResourcePageRoutingModule {}
