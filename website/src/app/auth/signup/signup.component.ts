import { DataService, AccountData } from '../../data.service';

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
    selector: 'app-register',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignUpComponent {
     errors : any;
    submitted = false;

    // message: string;
    // data: any = {
    //     email: "",
    //     password: "",
    //     representation: true,
    //     phone: ""
    // }

    signupForm: FormGroup;

    get email() { return this.signupForm.get('email'); }
    get password() { return this.signupForm.get('password'); }
    get password_confirm() { return this.signupForm.get('password_confirm'); }

     errorGet(obj) {
          return Object.keys(obj)[0];
     }
    
     constructor(   private dataService: DataService,
                    public authService: AuthService,
                    public router: Router,
                    private fb: FormBuilder) {
        this.signupForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            password_confirm: new FormControl('', [Validators.required, Validators.minLength(6)])
          }, {
              // updateOn: "blur",
              validator: this.checkPasswords
            })
     }

     ngOnInit() {
     }

     checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.get('password').value;
        let password_confirm = group.get('password_confirm').value;

        return pass === password_confirm ? null : { notSame: true }     
     }

     onSubmit() {
          if (this.signupForm.valid) {
               console.log('submitting form..');
               const account : AccountData = {
                    email: this.email.value,
                    password: this.password.value
               };
               this.dataService.accountPut(account).subscribe(
                    (resp) => {
                         this.router.navigate(["/signup/confirm"]);
                    },
                    (err) => {
                         console.log("error");
                         this.errors = err.error;
                         console.log(err.error);
                    });
        }
        else {
            console.log('not valid');
        }
    }

    getErrorText(key) {
         switch (key) {
               case "email_is_not_in_use":
                    return "Email address is already in use. Maybe try to log in instead of signing up.";

               default:
                    return "Unknown error";
         }
    }
}