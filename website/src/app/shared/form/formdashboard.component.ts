import { Component, Input } from '@angular/core';

import {
  FormGroup,
} from '@angular/forms';

@Component({
     selector: 'weavver-form-field>',
     styleUrls: ["./form.component.scss"],
     template: `
     <ng-content><ng-content>
     `
})
export class WeavverFormDashboardComponent {
     constructor() {
     }
}
