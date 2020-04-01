import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

@Component({
     selector: 'application',
     templateUrl: './application.component.html',
     styleUrls: ['./application.component.scss']
})

export class ApplicationComponent implements OnInit {
     processing : Boolean = false;

     I$: Observable<any>;
     form: FormGroup;

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     get name() { return this.form.get('name'); }
     get client_id() { return this.form.get('client_id'); }
     get host_email() { return this.form.get('host_email'); }
     get host_url() { return this.form.get('host_url'); }

     constructor(private route : ActivatedRoute,
                 private cd : ChangeDetectorRef,
                 private graph : DataService,
                 public router : Router,
                 private fb : FormBuilder) { 
          this.form = this.fb.group({
               name: new FormControl('', [Validators.required]),
               client_id: new FormControl('', [Validators.required]),
               host_email: new FormControl('', [Validators.required]),
               host_url: new FormControl('', [Validators.required])
          }, {
               updateOn: "blur"
          });
          this.processing = true;
     }

     ngOnInit() {
          this.route.queryParams.subscribe(params => {
               console.log(params);
               this.graph.getApplication([ Number(params.id) ]).subscribe(response => {
                    this.name.setValue(response.data.applications[0].name);
                    this.client_id.setValue(response.data.applications[0].client_id);
                    this.host_email.setValue(response.data.applications[0].host_email);
                    this.host_url.setValue(response.data.applications[0].host_url);

                    this.processing = false;
                    this.cd.markForCheck();
               });
          });
     }

     onSubmit() {
          this.setProperty("name", this.name.value);
          this.setProperty("client_id", this.client_id.value);
          this.setProperty("host_email", this.host_email.value);
          this.setProperty("host_website", this.host_url.value);
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