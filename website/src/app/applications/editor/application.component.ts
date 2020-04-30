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
          ApplicationsQueryVariables,
          ApplicationsDocument
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
import { FormModel } from 'src/app/shared/form/form.component';
import { WeavverFormService } from 'src/app/shared/form/form.service';
import { Subscription } from 'rxjs';

@Component({
     selector: 'application',
     template: `
          <weavver-form
               [model]="model"
               [datasource]="applications"
               (delete)="delete($event)">
          <dashboard>
               <span *ngIf="!node">Loading...</span>
               <div style="text-align: center; padding-top: 20px; border: solid 1px #CCCCCC; max-width: 275px; margin: auto; margin-bottom: 20px;" *ngIf="node"><h2>{{ node.name }}</h2>
               <div style="text-align: center; padding-top: 25px; padding-bottom: 25px;">
                    <button type="button" class="btn btn-info" style="min-width: 200px; margin: 15px;" (click)="launch()">Launch</button>
               </div></div>
          </dashboard>
          </weavver-form>
     `,
     styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
     model : FormModel;
     node: Application;

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     constructor(public formService : WeavverFormService,
                 private route : ActivatedRoute,
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
                         placeholder: "name",
                         required: true,
                         let_edit: true
                    },
                    {
                         title: "Host",
                         fields: [
                              {
                                   name: "host_email",
                                   title: "Email",
                                   placeholder: "email",
                                   let_edit: true
                              },
                              {
                                   name: "host_url",
                                   title: "URL",
                                   placeholder: "https://example.com/",
                                   let_edit: true
                              }
                         ]
                    },
                    {
                         title: "oAuth2 Credentials",
                         fields: [
                              {
                                   name: "client_id",
                                   title: "Client ID",
                                   placeholder: "client id placeholder",
                                   let_edit: false
                              },
                              {
                                   name: "client_secret",
                                   title: "Client Secret",
                                   placeholder: "client secret placeholder",
                                   let_edit: false
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

     sub_node_updated : Subscription = null;
     sub_node_set : Subscription = null;

     ngOnInit() {
          this.sub_node_updated = this.formService.node_updated.subscribe(data => { this.node = data as Application; });

          this.sub_node_set = this.formService.node_set.subscribe(data => {
               this.node = data as Application;
               this.form_node_set(data);
          });
     }

     ngOnDestroy() {
          this.sub_node_set.unsubscribe();
          this.sub_node_updated.unsubscribe();
          console.log("application unsubscribing");
     }

     form_node_active(node : Application) {
          this.node = node;
     }

     form_node_set(node) {
          console.log("form_node_set");
          var app_input : Application_Input = node;
          app_input.id = Number(this.route.snapshot.queryParams.id);
          var add_args : Applications_SetMutationVariables = {
               application: app_input
          };
          this.applications_set.mutate(add_args, {
               refetchQueries: [ {
                    query: ApplicationsDocument,
                    variables: { filter_input: {} } } ],
               awaitRefetchQueries: true
          }).subscribe(result => {
          console.log("applications mutation result:", result);
               this.formService.processing.next(false);
               this.formService.node_updated.next(result.data.applications_set);
          });
     }

     launch() {
          window.open(this.node["host_url"], "_blank");
     }

     delete(node) {
          console.log("delete", node);
          var delete_arg : Applications_DeleteMutationVariables = {
               application: {
                    id: Number(this.route.snapshot.queryParams.id)
               }
          }
          this.applications_delete.mutate(delete_arg, {
               refetchQueries: [ {
                    query: ApplicationsDocument,
                    variables: { filter_input: {} } } ],
               awaitRefetchQueries: true }
          ).subscribe(result => {
               console.log("delete result", result)
               this.cd.markForCheck();
               this.formService.processing.next(false);
               if (result.data.applications_delete) {
                    this.router.navigateByUrl("applications");
               }
          });
     }
}