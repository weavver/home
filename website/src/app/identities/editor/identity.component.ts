import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

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
     processing : Boolean = false;

     I$: Observable<any>;
     form: FormGroup;

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     get name_given() { return this.form.get('name_given'); }
     get name_family() { return this.form.get('name_family'); }
     get email() { return this.form.get('email'); }

     constructor(private cd: ChangeDetectorRef, private graph: DataService, public router: Router, private fb: FormBuilder) { 
          this.form = this.fb.group({
               name_given: new FormControl('', [Validators.required]),
               name_family: new FormControl('', [Validators.required]),
               email: new FormControl('', [Validators.required])
          }, {
               updateOn: "blur"
          });
          this.processing = true;
     }

     ngOnInit() {
          // this.I$ = this.graph.I()
          //      .pipe(
          //           map(result => result.data.I),
          //         );

          this.graph.I().subscribe(x => {
               this.name_given.setValue(x.data.I.name_given);
               this.name_family.setValue(x.data.I.name_family);
               this.email.setValue(x.data.I.email);
               console.log(x.data.I)

               this.processing = false;
               this.cd.markForCheck();
          });
     }

     onSubmit() {
          this.processing = true;
          this.setProperty("name_given", this.name_given.value);
          this.setProperty("name_family", this.name_family.value);
          this.setProperty("email", this.email.value);
     }

     setProperty(property, value) {
          this.graph.identity_property_set("email", this.email.value)
               .subscribe(({ data }) => {
                         console.log('got data', data);
                         this.processing = false;
                         this.cd.markForCheck();
                    },(error) => {
                         console.log('there was an error sending the query', error);
                    });
     }
}