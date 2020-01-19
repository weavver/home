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
     selector: 'app-password',
     templateUrl: './password.component.html',
     styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
     data: any = {
          password_current: "john",
          password_new: "doe"
     }

     form: FormGroup;

     get password_current() { return this.form.get('password_current'); }
     get password_new() { return this.form.get('password_new'); }
     get password_new_confirm() { return this.form.get('password_new_confirm'); }

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     constructor(public authService: AuthService, public router: Router, private fb: FormBuilder) {
          this.form = this.fb.group({
                    password_current: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
                    password_new: new FormControl('', [Validators.required, Validators.minLength(3)]),
                    password_new_confirm: new FormControl('', [Validators.required, Validators.minLength(6)])
               }, {
                    updateOn: "blur",
                    //   validator: this.checkPasswords
               })
     }

     onSubmit() {
          this.router.navigate(["/password/changed"]);
     }

     logout() {
          this.authService.logout();
          // this.setMessage();
     }
}