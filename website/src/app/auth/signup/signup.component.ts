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
    
    constructor(public authService: AuthService, public router: Router, private fb: FormBuilder) {
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
        // console.log(this.data);
        // this.form.dirty
        if (this.signupForm.valid) {
            console.log('form submitted');

            this.router.navigate(["/signup/confirm"]);
        }
        else {
            console.log('not valid');
        }
    }
}