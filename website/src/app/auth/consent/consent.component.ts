import { DataService } from '../../data.service';

import { ActivatedRoute } from '@angular/router';

import { Component, ChangeDetectorRef } from '@angular/core';
import {
    Router,
    NavigationExtras
}
from '@angular/router';
import {
    FormsModule,
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
  } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Application_GiveConsentGQL,
     Application_GiveConsentMutationVariables,
     ApplicationsGQL,
     ApplicationsQueryVariables } from 'src/generated/graphql';

import { Application,
     Application_GetByClientIdGQL,
     Application_GetByClientIdMutationVariables } from 'src/generated/graphql';

export interface oauth2_params {
     client_id : string,
     redirect_uri : string
}

@Component({
    selector: 'app-login',
    templateUrl: './consent.component.html',
    styleUrls: ['./consent.component.scss']
})
export class ConsentComponent {
     title : string = "loading...";
     queryParams : oauth2_params;
     application : Application;
     oauth2params : { redirect_uri: "", flow: "", response_type: "" };
     processing: boolean = false;
     error: boolean = false;
     submitText: string = "Authorize";
     form: FormGroup;
     data: any = {
          app_name: "Placeholder App",
          identifier: "",
          email: "",
          app_giver: "",
          website: "",
          privacy_policy: "",
          catalogued_at: ""
     }
     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     constructor(private cd: ChangeDetectorRef,
                 public authService: AuthService,
                 public router: Router,
                 private fb: FormBuilder,
                 public application_giveConsent : Application_GiveConsentGQL,
                 private application_getbyclientid : Application_GetByClientIdGQL,
                 private route: ActivatedRoute) {

          this.form = this.fb.group({}, {updateOn: "blur"});

          this.authService.showSidebar = true;

          this.route.queryParams.subscribe(queryParams => {
               console.log("params", queryParams);
               this.oauth2params = {
                    redirect_uri: queryParams['redirect_uri'],
                    flow: queryParams['flow'],
                    response_type: queryParams["response_type"]
               }

               var client_id : string = queryParams['client_id'] as string;

               this.route.queryParams.subscribe(params => {
                    if (params && params.client_id) {
                         this.processing = true;
                         this.queryParams = params as oauth2_params;

                         var args : Application_GetByClientIdMutationVariables = {
                              client_id: this.queryParams.client_id
                         };
                         this.application_getbyclientid.mutate(args).subscribe((response) => {
                              console.log("mmm", response);
                              this.application = response.data.application_getByClientId as Application;
                              this.title = "Consent request of \"" + this.application.name + "\"";
                              this.cd.markForCheck();
                              this.processing = false;
                         });
                    }
               });
               // var query : ApplicationsQueryVariables = {
               //      filter_input: {
               //           client_id : client_id
               //      }
               // };
               // this.application.watch(query).valueChanges.pipe(
               //      map(result => result.data.applications),
               //      tap((data) => console.log("aaaa values updating", data)),
               //      tap(() => this.cd.markForCheck()),
               //      tap(() => this.processing = false)
               // );
               // this.error = oauth2params.redirect_uri;
          });
     }

     authorize() {
          console.log("authorizing...");
          this.error = false;
          this.processing = true;
          this.submitText = 'Authorizing..';

          var giveConsent_arguments : Application_GiveConsentMutationVariables = {
               client_id: this.queryParams.client_id
          };

          this.application_giveConsent.mutate(giveConsent_arguments).subscribe((response) => {
                    let params = response.data.application_giveConsent;
                    console.log("params", params);
                    let formatted_redirect_uri = this.oauth2params.redirect_uri + "?code=" + params.code
                                                                                + "&scope=" + params.scope
                                                                                + "&authuser=" + params.authuser
                                                                                + "&hd=" + params.hd
                                                                                + "&prompt=" + params.prompt;

                    // alert(formatted_redirect_uri);
                    document.location.href = formatted_redirect_uri;
               },
               (error) => {
                    this.processing = false;
                    this.submitText = "Authorize";
                    console.log(error);
                    this.error = true;
                    this.cd.markForCheck();
                 }
          );
     }

     cancel() {
          document.location.href = this.oauth2params.redirect_uri;
     }
}