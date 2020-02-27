import { DataService } from '../data.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

@Component({
     selector: 'app-identity',
     templateUrl: './identity.component.html',
     styleUrls: ['./identity.component.scss']
})

export class IdentityComponent implements OnInit {

     I$: Observable<any>;
     form: FormGroup;

     errorGet(obj) {
          return Object.keys(obj)[0];
      }

     get name_given() { return this.form.get('name_given'); }
     get name_family() { return this.form.get('name_family'); }
     get email() { return this.form.get('email'); }

     constructor(private graph: DataService, public router: Router, private fb: FormBuilder) { 
          this.form = this.fb.group({
               name_given: new FormControl('', [Validators.required]),
               name_family: new FormControl('', [Validators.required]),
               email: new FormControl('', [Validators.required])
          }, {
               updateOn: "blur"
          });
     }
     
     ngOnInit() {
          this.I$ = this.graph.I()
               .pipe(
                    map(result => result.data.I)
                  );

          this.graph.I().subscribe(x => {
               this.name_given.setValue(x.data.I.name_given);
               this.name_family.setValue(x.data.I.name_family);
               this.email.setValue(x.data.I.email);
               console.log(x.data.I)
          });
     }

     onSubmit() {
          this.graph.identity_update("name_given", this.name_given.value);
          this.graph.identity_update("name_family", this.name_family.value);
          this.graph.identity_update("email", this.email.value);
    }
}