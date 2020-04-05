import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
          EchoGQL,
          MutationEchoArgs,
          Application,
          Application_Input,
          Applications_SetGQL,
          Applications_SetMutationVariables,
          Applications_DeleteGQL,
          Applications_DeleteMutationVariables,
          ApplicationsGQL,
          ApplicationsQueryVariables
     } from '../../../generated/graphql';

import {
    Router,
    NavigationExtras,
    ActivatedRoute
}
from '@angular/router';
import {
    FormsModule,
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
  } from '@angular/forms';

@Component({
     selector: 'application',
     templateUrl: './application.component.html',
     styleUrls: ['./application.component.scss']
})

export class ApplicationComponent implements OnInit {
     processing : Boolean = false;

     I$: Observable<any>;
     form: FormGroup;

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     application : any;

     get name() { return this.form.get('name'); }
     get client_id() { return this.form.get('client_id'); }
     get host_email() { return this.form.get('host_email'); }
     get host_url() { return this.form.get('host_url'); }

     constructor(private route : ActivatedRoute,
                 private cd : ChangeDetectorRef,
                 public echo : EchoGQL,
                 public applications : ApplicationsGQL,
                 public applications_set : Applications_SetGQL,
                 public applications_delete : Applications_DeleteGQL,
                 private graph : DataService,
                 public router : Router,
                 private formBuilder : FormBuilder) {
          this.form = this.formBuilder.group({
               name: new FormControl('', [Validators.required]),
               client_id: new FormControl('', [Validators.required]),
               host_email: new FormControl('', [Validators.required]),
               host_url: new FormControl('', [Validators.required])
          }, {
               updateOn: "blur"
          });
     }

     ngOnInit() {
          this.processing = true;
          this.route.queryParams.subscribe(params => {
               console.log(params);
               if (params.id) {
                    var filter : ApplicationsQueryVariables = {
                         filter_input: {
                              id: [ Number(params.id) ]
                         }
                    }
                    this.applications.watch(filter).valueChanges.subscribe(result => {
                         console.log(result);
                         if (result.data.applications.length > 0) {
                              this.application = result.data.applications[0];
                              this.form.patchValue(result.data.applications[0]);

                              this.processing = false;
                              this.cd.markForCheck();
                         } else { // application not found
                              alert("An application with that ID is not available.");
                              this.router.navigateByUrl("applications");
                         }
                    });
               } else {
                    this.processing = false;
                    this.cd.markForCheck();
               }
          });
     }

     submit() {
          this.processing = true;

          var app_input : Application_Input = this.form.value;
          app_input.id = Number(this.route.snapshot.queryParams.id);
          var add_args : Applications_SetMutationVariables = {
               application: app_input
          };
          this.applications_set.mutate(add_args).subscribe(result => console.log("asdfasdf", result));
          this.processing = false;
          this.cd.markForCheck();
     }

     launch() {
          alert("launching");
     }

     delete() {
          this.processing = true;
          var delete_arg : Applications_DeleteMutationVariables = {
               application: {
                    id: Number(this.route.snapshot.queryParams.id)
               }
          }
          this.applications_delete.mutate(delete_arg).subscribe(result => {
               console.log("delete result", result)

               this.processing = false;
               this.cd.markForCheck();

               if (result.data.applications_delete) {
                    this.router.navigateByUrl("applications");
               }
          });
     }
}