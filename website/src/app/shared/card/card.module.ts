import { CommonModule } from "@angular/common";
import {NgModule} from '@angular/core';
import { WeavverCardComponent } from './card.component';

@NgModule({
     imports: [CommonModule],
     declarations:[WeavverCardComponent],
     exports:[WeavverCardComponent]
})
export class WeavverCardModule
{
}

