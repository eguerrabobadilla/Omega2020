import {NgModule} from '@angular/core';
import { PillMenuComponent } from '../components/pill-menu/pill-menu.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        IonicModule,
        CommonModule
    ],
    declarations:[PillMenuComponent],
    exports:[PillMenuComponent]
})
export class GlobalModule
{

}