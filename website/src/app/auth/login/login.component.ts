import { Component } from '@angular/core';
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
    data: any = {
        username: "john",
        password: "doe"
    }

    loginForm: FormGroup;

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }

    errorGet(obj) {
        return Object.keys(obj)[0];
    }

    constructor(public authService: AuthService, public router: Router, private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
          }, {
              updateOn: "blur",
            //   validator: this.checkPasswords
            })
    }


    // setMessage() {
        // this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
    // }

    onSubmit() {
    //     this.message = 'Trying to log in ...';

    //     this.authService.login().subscribe(() => {
    //         this.setMessage();
    //         if (this.authService.isLoggedIn) {
    //             // If no redirect has been set, use the default
    //             let redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/admin';

    //             let navigationExtras: NavigationExtras = {
    //                 queryParamsHandling: 'preserve',
    //                 preserveFragment: true
    //             };

    //             this.router.navigateByUrl(redirect, navigationExtras);
    //         }
    //     });
    }

    logout() {
        this.authService.logout();
        // this.setMessage();
    }
}