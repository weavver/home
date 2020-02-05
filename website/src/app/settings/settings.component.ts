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
import { AuthService } from '../auth/auth.service';

@Component({
     selector: 'app-settings',
     templateUrl: './settings.component.html',
     styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {

     form: FormGroup;

     errorGet(obj) {
          return Object.keys(obj)[0];
      }

     get name_first() { return this.form.get('name_first'); }
     get name_last() { return this.form.get('name_last'); }

     constructor(public authService: AuthService, public router: Router, private fb: FormBuilder) { 
          this.form = this.fb.group({
              name_first: new FormControl('', [Validators.required]),
              name_last: new FormControl('', [Validators.required])
            }, {
                updateOn: "blur",
              //   validator: this.checkPasswords
              })
     }

     ngOnInit() {
     }

     
    onSubmit() {
     //     this.message = 'Trying to log in ...';
          alert('test');
    }
}
