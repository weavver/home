import { DataService } from '../../data.service';
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
     selector: 'application',
     templateUrl: './application.component.html',
     styleUrls: ['./application.component.scss']
})

export class ApplicationComponent implements OnInit {

     I$: Observable<any>;
     form: FormGroup;

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     get name() { return this.form.get('name'); }
     get client_id() { return this.form.get('client_id'); }
     get giver_email() { return this.form.get('giver_email'); }
     get giver_website() { return this.form.get('giver_website'); }

     constructor(private graph: DataService, public router: Router, private fb: FormBuilder) { 
          this.form = this.fb.group({
               name: new FormControl('', [Validators.required]),
               client_id: new FormControl('', [Validators.required]),
               giver_email: new FormControl('', [Validators.required]),
               giver_website: new FormControl('', [Validators.required])
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
               // this.name_given.setValue(x.data.I.name_given);
               // this.name_family.setValue(x.data.I.name_family);
               // this.email.setValue(x.data.I.email);
               console.log(x.data.I)
          });
     }

     onSubmit() {
          // this.graph.identity_property_set("name_given", this.name_given.value);
          // this.graph.identity_property_set("name_family", this.name_family.value);
          // this.graph.identity_property_set("email", this.email.value);
     }
}