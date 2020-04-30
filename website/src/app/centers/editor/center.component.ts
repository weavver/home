import { Component, OnInit, ChangeDetectorRef, Directive } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import {
          EchoGQL,
          MutationEchoArgs,
          Center,
          Center_Input,
          Centers_SetGQL,
          Centers_SetMutationVariables,
          Centers_DeleteGQL,
          Centers_DeleteMutationVariables,
          CentersGQL,
          ApplicationsQueryVariables,
          CentersDocument
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
import { WeavverFormService } from 'src/app/shared/form/form.service';
import { FormModel } from 'src/app/shared/form/form.component';

@Component({
     selector: 'center_node',
     template: `<weavver-form
          [model]="model"
          [datasource]="centers"
          (delete)="delete($event)">
          <dashboard>
               <h2 *ngIf="node">{{ node.name }}</h2>
               Dashboard numbers: 0<br />
               <br />
               <br />
          </dashboard>
     </weavver-form>
     `,
     styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {
     model : FormModel;
     node: Center;

     constructor(public formService : WeavverFormService,
                 private route : ActivatedRoute,
                 public centers : CentersGQL,
                 public centers_set : Centers_SetGQL,
                 public centers_delete : Centers_DeleteGQL,
                 private cd : ChangeDetectorRef,
                 public router : Router) {

          this.model = {
               route: "/centers",
               title_plural: "Centers",
               title: "Center",
               label: "center",
               set: "centers",
               data: [
                    {
                         name: "name",
                         title: "Name",
                         placeholder: "name",
                         required: true,
                         let_edit: true
                    },
                    {
                         title: "Email Server",
                         fields: [
                              {
                                   name: "smtp_server",
                                   title: "Server",
                                   placeholder: "host or ip address",
                                   let_edit: true,
                                   required: false
                              },
                              {
                                   name: "smtp_port",
                                   title: "Port",
                                   placeholder: "port (default: 25)",
                                   let_edit: true,
                                   required: false
                              },
                              {
                                   name: "smtp_user",
                                   title: "Server",
                                   placeholder: "host or ip address",
                                   let_edit: true,
                                   required: false
                              },
                              {
                                   name: "smtp_password",
                                   title: "Password",
                                   placeholder: "password",
                                   let_edit: true,
                                   required: false
                              }
                         ]
                    },
                    {
                         title: "Twilio",
                         fields: [
                              {
                                   name: "twilio_api_key",
                                   title: "API Key",
                                   placeholder: "api key",
                                   let_edit: true,
                                   required: false
                              }
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
          console.log("init");
          this.sub_node_updated = this.formService.node_updated.subscribe(data => { this.node = data as Center; });

          this.sub_node_set = this.formService.node_set.subscribe(data => {
               console.log("center", data);
               this.node = data as Center;
               this.form_node_set(data);
          });
     }

     ngOnDestroy() {
          this.sub_node_set.unsubscribe();
          this.sub_node_updated.unsubscribe();
          console.log("center unsubscribing");
     }

     form_node_active(node : Center) {
          this.node = node;
          console.log("node changed");
     }

     form_node_set(node) {
          var app_input : Center_Input = node;
          app_input.id = Number(this.route.snapshot.queryParams.id);
          var add_args : Centers_SetMutationVariables = {
               center: app_input
          };
          this.centers_set.mutate(add_args, { refetchQueries: [ {query: CentersDocument, variables: { filter_input: {} }} ] }).subscribe(result => {
               console.log("centers mutation result:", result);
               this.formService.processing.next(false);
               this.formService.node_updated.next(result.data.centers_set);
          });
     }

     launch() {
          // window.open(this.node.host_url, "_blank");
     }

     delete(node : Center) {
          console.log("delete", node);
          var delete_arg : Centers_DeleteMutationVariables = {
               center: {
                    id: Number(this.route.snapshot.queryParams.id)
               }
          }
          this.centers_delete.mutate(delete_arg, { refetchQueries: [ {query: CentersDocument, variables: { filter_input: {} }} ] }).subscribe(result => {
               console.log("delete result", result)

               this.formService.processing.next(false);
               if (result.data.centers_delete) {
                    this.router.navigateByUrl(this.model["set"]);
               }
          });
     }
}