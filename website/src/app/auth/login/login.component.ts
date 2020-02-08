import { DataService } from '../../data.service';

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

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
     logInProcessing: boolean = false;

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
                private dataService: DataService) {

          this.loginForm = this.fb.group({
                    email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
                    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
               },
               {
                    updateOn: "blur"
               })
    }

     logIn() {
          this.logInProcessing = true;
          this.logInText = 'Trying to log in ...';
          this.authService.getToken(this.email, this.password).subscribe(() => {
               let redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/settings';
               let navigationExtras: NavigationExtras = {
                    queryParamsHandling: 'preserve',
                    preserveFragment: true
               };
               this.router.navigateByUrl(redirect, navigationExtras);
          });
     }
}