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

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
     processing: boolean = false;
     error: boolean = false;

     logInText: string = "Log In";

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
                 private data_app: DataService,
                 private route: ActivatedRoute) {

          this.loginForm = this.fb.group({
                    email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
                    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
               }, {
                    updateOn: "blur"
               })

               this.route.queryParams.subscribe(params => this.data_app.login_params = params);
     }

     logIn() {
          this.error = false;
          this.processing = true;
          this.logInText = 'Trying to log in ...';
          this.authService.tokenGet(this.email.value, this.password.value).subscribe(() => {
                    let redirect = '/applications';

                    console.log(this.data_app.login_params);
                    if (this.data_app.login_params.client_id)
                         redirect = '/consent';

                    if (this.authService.redirectUrl) {
                         redirect = this.authService.redirectUrl;
                         this.authService.redirectUrl = null;
                    }
                    this.router.navigateByUrl(redirect);
               },
               (error) => {
                    this.processing = false;
                    this.logInText = "Log In";
                    this.error = error // error path
                    // console.log(error);
                    this.error = true;
                    this.cd.markForCheck();
               }
          );
     }
}