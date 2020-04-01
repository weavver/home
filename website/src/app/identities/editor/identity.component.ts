import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import {
     Event,
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

     constructor(private cd: ChangeDetectorRef,
                 private graph: DataService,
                 public router: Router,
                 private fb: FormBuilder,
                 private route: ActivatedRoute) { 
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
          console.log("navigated");
          
          this.route.queryParams.subscribe(params => {
               if (!params.id) {
                    this.graph.I().subscribe(x => {
                         this.name_given.setValue(x.data.I.name_given);
                         this.name_family.setValue(x.data.I.name_family);
                         this.email.setValue(x.data.I.email);

                         this.processing = false;
                         this.cd.markForCheck();
                    });
               } else if (params.id == "new") {
                    this.name_given.setValue("");
                    this.name_family.setValue("");
                    this.email.setValue("");
                    this.processing = false;
                    this.cd.markForCheck();
               }
               else {
                    this.graph.identities([ Number(params.id) ]).subscribe(response => {
                         console.log(response.data);
                         if (response.data.identities.length > 0) {
                              this.name_given.setValue(response.data.identities[0].name_given);
                              this.name_family.setValue(response.data.identities[0].name_family);
                              this.email.setValue(response.data.identities[0].email);
                         } else {
                              alert("Identity not found.");
                         }
                         this.processing = false;
                         this.cd.markForCheck();
                    });
               }
          });
     }

     onSubmit() {
          this.setProperty("name_given", this.name_given.value);
          this.setProperty("name_family", this.name_family.value);
          this.setProperty("email", this.email.value);
     }

     setProperty(property, value) {
          this.processing = true;
          this.graph.identity_property_set(property, value)
                    .subscribe(({ data }) => {
                         console.log('got data', data);
                         this.processing = false;
                         this.cd.markForCheck();
                    },(error) => {
                         console.log('there was an error sending the query', error);
                    });
     }
}