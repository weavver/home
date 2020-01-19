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
    templateUrl: './signup-confirm.component.html',
    styleUrls: ['./signup-confirm.component.scss']
})
export class SignUpConfirmComponent {
    constructor(public authService: AuthService, public router: Router, private fb: FormBuilder) {
    }
}