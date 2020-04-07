import { Component, OnInit, ChangeDetectorRef, Directive } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
     selector: 'test',
     template: `<weavver-form
          [model]="model"
          [datasource]="applications"
          [processing]="processing"
          (set)="set($event)"
          (delete)="delete($event)">
          <dashboard>
               <div style="text-align: center; padding-top: 25px; padding-bottom: 25px;">
                    <button type="button" class="btn btn-info" style="min-width: 200px; margin: 15px;" (click)="launch()">Launch</button>
               </div>
          </dashboard>
     </weavver-form>
     `,
     styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
     processing:Subject<Boolean> = new Subject();
     model : {};

     errorGet(obj) {
          return Object.keys(obj)[0];
     }


     constructor(private route : ActivatedRoute,
                 public applications : ApplicationsGQL,
                 public applications_set : Applications_SetGQL,
                 public applications_delete : Applications_DeleteGQL,
                 private cd : ChangeDetectorRef,
                 public router : Router) {

          this.model = {
               route: "/applications",
               title_plural: "Applications",
               title: "Application",
               label: "application",
               set: "applications",
               data: [
                    {
                         name: "name",
                         title: "Name",
                         placeholder: "name"
                    },
                    {
                         title: "Host",
                         fields: [
                              {
                                   name: "host_email",
                                   title: "Email",
                                   placeholder: "email"
                              },
                              {
                                   name: "host_url",
                                   title: "URL",
                                   placeholder: "https://example.com/"
                              }
                         ]
                    },
                    {
                         title: "oAuth2 Credentials",
                         fields: [
                              {
                                   name: "client_id",
                                   title: "Client ID",
                                   placeholder: "client id placeholder"
                              },
                              {
                                   name: "client_secret",
                                   title: "Client Secret",
                                   placeholder: "client secret placeholder"
                              },
                              // {
                              //      name: "client_secret2",
                              //      title: "Client Checkbox",
                              //      placeholder: "client secret placeholder",
                              //      type: "textarea",
                              //      textarea_rows: 5
                              // }
                         ]
                    }
               ],
               let: {
                    save: true,
                    delete: true
               }
          };
     }

     ngOnInit() {
     }

     item_selected(data) {
          this.item = data;
     }

     set(data) {
          var app_input : Application_Input = data.data;
          app_input.id = Number(this.route.snapshot.queryParams.id);
          var add_args : Applications_SetMutationVariables = {
               application: app_input
          };
          this.applications_set.mutate(add_args).subscribe(result => {
               console.log("asdfasdf", result);
               this.processing.next(false);
          });
     }

     launch() {
          alert("launch");
     }

     delete(data) {
          console.log("delete", data);
          var delete_arg : Applications_DeleteMutationVariables = {
               application: {
                    id: Number(this.route.snapshot.queryParams.id)
               }
          }
          this.applications_delete.mutate(delete_arg).subscribe(result => {
               console.log("delete result", result)

               this.processing.next(false);
               if (result.data.applications_delete) {
                    this.router.navigateByUrl("applications");
               }
          });
     }
}