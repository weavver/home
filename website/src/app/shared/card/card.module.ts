import { CommonModule } from "@angular/common";
import {NgModule} from '@angular/core';
import { WeavverCardComponent, WeavverCardButtons, WeavverCardBody, CallbackPipe } from './card.component';

@NgModule({
     imports: [CommonModule],
     declarations:[WeavverCardComponent, WeavverCardButtons, WeavverCardBody, CallbackPipe],
     exports:[WeavverCardComponent, WeavverCardButtons, WeavverCardBody]
})
export class WeavverCardModule
{
}