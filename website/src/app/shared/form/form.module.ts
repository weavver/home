import { CommonModule } from "@angular/common";
import {NgModule} from '@angular/core';
import { WeavverFormComponent, WeavverFormComponentDashboard } from './form.component';

import { ReactiveFormsModule }         from '@angular/forms';
import { WeavverTabsModule } from '../tabs/tabs.module';
import { WeavverCardModule } from '../card/card.module';
import { WeavverFormFieldComponent } from './formfield.component';

@NgModule({
     imports: [
          CommonModule,
          ReactiveFormsModule,
          WeavverTabsModule,
          WeavverCardModule
     ],
     declarations: [WeavverFormComponent, WeavverFormFieldComponent, WeavverFormComponentDashboard],
     exports: [WeavverFormComponent, WeavverFormFieldComponent, WeavverFormComponentDashboard]
})
export class WeavverFormModule
{
}