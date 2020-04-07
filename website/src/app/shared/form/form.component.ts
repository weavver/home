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

import { FormService } from './form.service';

import {
          FormsModule,
          FormGroup,
          FormBuilder,
          Validators,
          FormControl
        } from '@angular/forms';

import * as Apollo from 'apollo-angular';
import { Filter_Input, ApplicationsQuery, ApplicationsQueryVariables } from 'src/generated/graphql';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Directive({ selector: 'dashboard' })
export class WeavverFormComponentDashboard { }

@Component({
  selector: 'weavver-form',
  templateUrl: './form.component.html',
  styleUrls: ["./form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeavverFormComponent implements OnInit {
     @Input()
     processing: Subject<any>;
     _processing: Boolean = false;

     @Input() model;
     @Input() datasource : Apollo.Query<any, any>;
     form: FormGroup;
     dataitem: {};

     new: Boolean = true;

     constructor(public formService : FormService,
                 private route : ActivatedRoute,
                 private formBuilder : FormBuilder,
                 private cd : ChangeDetectorRef) {
          this.form = this.formBuilder.group({}, { updateOn: "blur" });

          formService.Test();
     }

     async ngOnInit() : Promise<void> {
          if (!this.processing) {
               this.processing = new Subject<Boolean>();
          }
          this.processing.subscribe(event => {
               this._processing = event;
               this.cd.markForCheck();
          });

          this.buildForm(this.model.data);

          console.log(this.datasource);

          this.processing.next(true);
          this.route.queryParams.subscribe(params => {
               console.log(params);
               if (params.id) {
                    this.new = false;
                    var filter : Filter_Input = {
                         id: [ Number(params.id) ],
                    }
                    this.datasource.watch({ filter_input: filter }).valueChanges.subscribe(result => {
                         console.log(result);
                         if (result.data[this.model.set].length > 0) {
                              this.dataitem = result.data[this.model.set][0];
                              console.log(result.data[this.model.set][0])
                              this.form.patchValue(result.data[this.model.set][0]);

                              this.processing.next(false);
                              this.cd.markForCheck();
                         } else {
                              alert("Data of type " + this.model.name + " with that ID is not available.");
                              // this.router.navigateByUrl("applications");
                         }
                    });
               } else {
                    this.processing.next(false);
                    this.cd.markForCheck();
               }
          });
     }

     buildForm(root) {
          root.forEach(item => {
               // console.log(item)
               if (item.name)
                    this.form.addControl(item.name, new FormControl('', [Validators.required]));

               if (item.fields)
                    this.buildForm(item.fields);
          });
     }

     @Output() set = new EventEmitter();

     set_click() {
          if (this.form.valid) {
               this.processing.next(true);
               this.set.emit({ data: this.form.getRawValue() });
          }
     }

     @Output() delete = new EventEmitter();

     delete_click() {
          this.delete.emit(this.form.getRawValue());
     }

     ngOnDestroy() {
          this.processing.unsubscribe();
     }
}