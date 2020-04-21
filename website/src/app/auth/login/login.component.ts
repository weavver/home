import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
  } from '@angular/forms';
import { AuthService } from '../auth.service';
import { take, first, tap, map, catchError } from 'rxjs/operators';

import { Application,
         Application_GetByClientIdGQL,
         Application_GetByClientIdMutationVariables } from 'src/generated/graphql';
import { responsePathAsArray } from 'graphql';

export interface oauth2_params {
     client_id : string
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
     processing: boolean = false;
     error: boolean = false;
     error504: boolean = false;

     logInText: string = "Log In";
     queryParams: oauth2_params;
     application : Application;

     data: any = {
          username: "",
          password: ""
     }

     loginForm: FormGroup;


     get email() { return this.loginForm.get('email'); }
     get password() { return this.loginForm.get('password'); }

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     constructor(private cd: ChangeDetectorRef,
                 public authService: AuthService,
                 public router: Router,
                 private fb: FormBuilder,
                 private application_getbyclientid : Application_GetByClientIdGQL,
                 private data_app: DataService,
                 private route: ActivatedRoute) {

          this.loginForm = this.fb.group({
                    email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
                    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
               }, {
                    updateOn: "submit"
               })

               this.route.queryParams.subscribe(params => {
                    if (params && params.client_id) {
                         this.processing = true;
                         this.queryParams = params as oauth2_params;
                         this.data_app.login_params = params;
                         
                         var args : Application_GetByClientIdMutationVariables = {
                              client_id: this.queryParams.client_id
                         };
                         this.application_getbyclientid.mutate(args).subscribe((response) => {
                              console.log("application_getbyclientid", response);
                              this.application = response.data.application_getByClientId as Application;
                              this.cd.markForCheck();
                              this.processing = false;
                         });
                    }
               });

               if (authService.isLoggedIn)
                    this.redirectAfterLogIn();
     }

     logIn() {
          this.error = false;
          this.error504 = false;
          this.processing = true;
          this.logInText = 'Trying to log in ...';
          if (this.loginForm.value) {
               this.authService.tokenGet(this.email.value, this.password.value).subscribe(() => {
                         this.redirectAfterLogIn();
                    },
                    (error) => {
                         this.processing = false;
                         this.logInText = "Log In";
                         // this.error = error // error path
                         console.log(error);
                         if (error.status == 504)
                              this.error504 = true;
                         else
                              this.error = true;
                         this.cd.markForCheck();
                    }
               );
          }
     }

     redirectAfterLogIn() {
          console.log("redirectAfterLogIn");
          console.log(this.data_app.login_params);

          let redirect = '/applications';

          if (this.route.snapshot.queryParams.client_id)
               redirect = '/consent';
          else if (this.route.snapshot.queryParams.redirect_uri) {
               redirect = this.route.snapshot.queryParams.redirect_uri;
          }

          console.log(redirect)
          this.router.navigate([redirect], { queryParamsHandling: "preserve" });
     }
}