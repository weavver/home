import { Component, Input } from '@angular/core';

import {
  FormGroup,
} from '@angular/forms';

export interface field {
     name: string,
     title: string,
     type: string,
     textarea_rows: number,
     placeholder: string,
     let_edit : boolean
 }

@Component({
     selector: 'weavver-form-field>',
     styleUrls: ["./form.component.scss"],
     template: `
          <div [formGroup]="group" style="padding-bottom: 10px;">
               <div class="form-header">
                    <label [for]="field.name">{{ field.title }}</label>
                    <small class="form-text text-muted form-header-required" *ngIf="hasError(field.name)">
                         Required
                    </small>
                    <!-- <small class="form-text text-muted form-header-required" [hidden]="name.valid || name.pristine" *ngIf="(name.invalid && errorGet(name.errors) == 'name')">
                         A valid email is required.
                    </small> -->
               </div>
               <div [ngSwitch]="field.type">
                    <div *ngSwitchCase="'textarea'">
                         <textarea class="form-control" [id]="field.name" [rows]="field.textarea_rows"></textarea>
                    </div>
                    <div *ngSwitchCase="'checkbox'">
                         <input [formControlName]="field.name" type="checkbox" class="form-control" [placeholder]="field.placeholder" [name]="field.name" required>
                         <label class="form-check-label" for="exampleCheck1">{{ field.title }}</label>
                    </div>
                    <input *ngSwitchDefault [formControlName]="field.name" type="text" class="form-control" [placeholder]="field.placeholder" [name]="field.name" [readonly]="!field.let_edit">
               </div>
          </div>
     `
})
export class WeavverFormFieldComponent {
     @Input('group') group: FormGroup;
     @Input('field') field: field;
     // @Input() active = false;

     constructor() {
     }

     hasError(item) {
          // console.log("checking for error", item);
          // return true;
          // name.invalid && !name.pristine && errorGet(name.errors) == 'required'
     }

     test() {
          console.log(this.group.getRawValue());
     }
}
