import {
     Component,
     OnInit,
     ChangeDetectionStrategy,
     Input,
     ContentChild,
     AfterContentInit,
     ContentChildren,
     Directive,
     EventEmitter,
     Output,
     QueryList,
     ChangeDetectorRef} from '@angular/core';

import {
     FormsModule,
     FormGroup,
     FormBuilder,
     Validators,
     FormControl
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import * as Apollo from 'apollo-angular';
import { Filter_Input } from 'src/generated/graphql';
import { Subject, Subscription } from 'rxjs';
import { WeavverFormService } from './form.service';

@Directive({ selector: 'dashboard' })
export class WeavverFormComponentDashboard { }

export interface FormModel {
     title : string;
     title_plural : string;
     label : string;
     route : string;
     set : string;
     data : FormField[];
     let : {
          save: boolean,
          delete: boolean
     }
}


export interface FormField {
     name? : string;
     title? : string;
     placeholder? : string;
     let_edit? : boolean;
     required? : boolean;
     fields? : FormField[]
}

@Component({
     selector: 'weavver-form',
     template: `<!-- {{ model | json }} -->
     <card [loading]="_processing"
           title="{{ model.title }}"
           [state]="formService.form_state"
           [menu]="menu"
           (menuitem_clicked)="menuitem_clicked($event)">
     <card-body>
          <ng-content *ngIf="this.state=='view'" select="dashboard"></ng-content>
          <form [formGroup]="form" (ngSubmit)="set_click()">
               <tabs  *ngIf="this.state=='new' || this.state=='edit'">
               <tab title="General">
                    <hr />
                    <div class="form-group" *ngFor="let fieldroot of model.data">
                         <div *ngIf="!fieldroot.fields">
                              <weavver-form-field [group]="form" [field]="fieldroot"></weavver-form-field>
                         </div>
                         <div *ngIf="fieldroot.fields">
                              <div style="padding: 8px; border: solid 1px #CCCCCC;  border-radius: 3px;">
                                   <h4 style="padding-bottom: 8px;">{{ fieldroot.title }}</h4>
                                   <span *ngFor="let field of fieldroot.fields">
                                        <weavver-form-field [group]="form" [field]="field"></weavver-form-field>
                                   </span>
                              </div>
                         </div>
                    </div>
                    <div *ngIf="model.let.save" style="text-align: center;">
                         <button type="button" class="btn btn-primary" style="min-width: 200px; margin: 15px;" (click)="set_click()">Save</button>
                    </div>
               </tab>
               </tabs>
          </form>
     </card-body>
     </card>`,
     styleUrls: ["./form.component.scss"],
     changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeavverFormComponent implements OnInit {
     _processing: Boolean = false;
     state : String = "view";

     @Input() model;
     @Input() datasource : Apollo.Query<any, any>;
     form: FormGroup;
     node: {};

     new: Boolean = true;
     
     menu = {
          buttons: [
               {
                    action: "view", text: "View", warn: false, visible: true, title: "Cancel"
               },
               {
                    action: "edit", text: "Edit", warn: false, visible: true, title: "Edit"
               },
               {
                    action: "delete", text: "Delete", warn: true, visible: true, title: "Delete"
               }
          ]
     };

     constructor(public formService : WeavverFormService,
                 private route : ActivatedRoute,
                 private router : Router,
                 private formBuilder : FormBuilder,
                 private cd : ChangeDetectorRef) {
          this.form = this.formBuilder.group({}, { updateOn: "blur" });

          // formService.Test();
     }

     sub_node_processing : Subscription = null;
     sub_node_updated : Subscription = null;
     sub_node_set : Subscription = null;
     sub_form_state : Subscription = null;

     ngOnInit() {
          this.sub_node_processing = this.formService.processing.subscribe(event => {
               this._processing = event;
               this.cd.markForCheck();
          });

          this.sub_node_updated = this.formService.node_updated.subscribe(node => {
               console.log("form_node_updated", node);
               this.node = node;
               this.form.patchValue(node);
               if (!this.route.snapshot.queryParamMap.get("id")) {
                    this.router.navigateByUrl(this.model.set + "?id=" + node["id"]);
               }
               this.cd.markForCheck();
          });

          this.sub_form_state = this.formService.form_state.subscribe(_state => {
               switch (_state) {
                    case "new":
                         this.menu.buttons[0].visible = false;
                         this.menu.buttons[1].visible = false;
                         this.menu.buttons[2].visible = false;
                         break;
                         
                    case "view":
                         this.menu.buttons[0].visible = false;
                         this.menu.buttons[1].visible = true;
                         this.menu.buttons[2].visible = false;
                         break;
                         
                    case "edit":
                         this.menu.buttons[0].visible = true;
                         this.menu.buttons[1].visible = false;
                         this.menu.buttons[2].visible = true;
                         break;

                    default:
                         this.menu.buttons[0].visible = true;
                         break;
               }
               console.log("stategg", _state);
               this.state = _state as string;
               this.cd.markForCheck();
          });

          this.buildForm(this.model.data);

          console.log(this.datasource);

          this.formService.processing.next(true);
          this.route.queryParams.subscribe(params => {
               console.log("params", params);
               if (params.id) {
                    this.formService.form_state.next("view");
                    var filter : Filter_Input = {
                         id: [ Number(params.id) ],
                    }
                    this.datasource.watch({ filter_input: filter }).valueChanges.subscribe(result => {
                         console.log(result);
                         if (result.data[this.model.set].length > 0) {
                              console.log(result.data[this.model.set][0])

                              this.formService.node_updated.next(result.data[this.model.set][0]);
                              this.formService.processing.next(false);
                         } else {
                              alert("Data of type " + this.model.name + " with that ID is not available.");
                              this.router.navigateByUrl(this.model.set);
                         }
                    });
               } else {
                    this.formService.form_state.next("new");
                    this.formService.processing.next(false);
               }
          });
     }

     buildForm(root) {
          root.forEach(item => {
               // console.log(item)
               if (item.name) {
                    var validators = [];
                    if (item.required)
                         validators.push(Validators.required);

                    this.form.addControl(item.name, new FormControl('', validators));
               }

               if (item.fields)
                    this.buildForm(item.fields);
          });
     }

     @Output() delete = new EventEmitter();
     menuitem_clicked(item) {
          console.log("menu click", item);
          switch (item.action) {
               case "view":
                    this.formService.form_state.next("view");
                    break;

               case "edit":
                    this.formService.form_state.next("edit");
                    break;

               case "delete":
                    if (confirm("Do you want to delete this item?"))
                         this.delete.emit(this.form.getRawValue());
                    break;
          }
     }

     @Output() node_set = new EventEmitter();

     set_click() {
          if (this.form.valid) {
               this.formService.processing.next(true);
               this.formService.node_set.next(this.form.getRawValue());
          }
     }

     ngOnDestroy() {
          console.log("form control unsubscribing");
          this.sub_node_processing.unsubscribe();
          // this.sub_node_set.unsubscribe();
          this.sub_node_updated.unsubscribe();
          this.sub_form_state.unsubscribe();
     }
}