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
    templateUrl: './login-resetpassword.component.html',
    styleUrls: ['./login-resetpassword.component.scss']
})
export class LogInResetPasswordComponent {
    message: string = "Send Reset Code";    
    loginForm: FormGroup;

    get email() { return this.loginForm.get('email'); }

    errorGet(obj) {
        return Object.keys(obj)[0];
    }

     constructor(public authService: AuthService, public router: Router, private fb: FormBuilder) {
          this.loginForm = this.fb.group({
               email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email])
          }, {
               updateOn: "blur",
          })
     }

     onSubmit() {
          this.message = 'Requesting a reset code...';

          this.authService.passwordsReset(this.email.value).subscribe(() => {
                    this.router.navigate(["/login/resetpassword/confirm"]);
        });
    }
}