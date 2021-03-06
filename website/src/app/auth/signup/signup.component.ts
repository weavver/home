import { DataService, IdentityData } from '../../data.service';
import { Observable } from 'rxjs'

import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
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

import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
//     changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignUpComponent {
     signUpProcessing: boolean = false;
     signUpError: any;
     submitted = false;

     signupForm: FormGroup;

     get email() { return this.signupForm.get('email'); }
     get password() { return this.signupForm.get('password'); }
     get password_confirm() { return this.signupForm.get('password_confirm'); }

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     public constructor(private cd : ChangeDetectorRef,
                        public route : ActivatedRoute,
                        private dataService : DataService,
                        public authService : AuthService,
                        public router : Router,
                        private fb: FormBuilder) {
          this.signupForm = this.fb.group({
               email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
               password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
               password_confirm: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)])
          }, {
              // updateOn: "blur",
               validator: this.checkPasswords
          })
     }

     ngOnInit() {
          if (this.authService.isLoggedIn && this.route.snapshot.queryParams["client_id"]) {
               this.router.navigate(["/consent"], { queryParamsHandling: "merge" })
          }
     }

     checkPasswords(group: FormGroup) { // here we have the 'passwords' group
          let pass = group.get('password').value;
          let password_confirm = group.get('password_confirm').value;

          return pass === password_confirm ? null : { notSame: true }     
     }

     onSubmit() {
          this.signUpProcessing = true;
          if (this.signupForm.valid) {
               console.log('submitting form..');
               const identity : IdentityData = {
                    email: this.email.value,
                    password: this.password.value
               };
               this.dataService.identityPut(identity)
                    .subscribe(
                    (resp) => {
                         this.router.navigate(["/signup/confirm"]);
                    },
                    (err) => {
                         console.log(err);
                         this.signUpError = err.error.err;
                         this.signUpProcessing = false;
                         this.cd.detectChanges();
                    });
          }
        else {
            console.log('not valid');
        }
    }

    getErrorText(key) {
         switch (key) {
               case "email_is_not_in_use":
                    return "Email address is already in use. Maybe try to log in instead of signing up or reset your password.";

               default:
                    return "Unknown error";
         }
    }
}