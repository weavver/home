import { CommonModule } from "@angular/common";
import {NgModule} from '@angular/core';
import { WeavverTabsComponent } from './tabs.component';
import { WeavverTabComponent } from './tab.component';

@NgModule({
     imports: [CommonModule],
     declarations:[WeavverTabsComponent, WeavverTabComponent],
     exports:[WeavverTabsComponent, WeavverTabComponent]
})
export class WeavverTabsModule
{
}