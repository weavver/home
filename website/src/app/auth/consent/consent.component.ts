import { DataService } from '../../data.service';

import { ActivatedRoute } from '@angular/router';

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
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './consent.component.html',
    styleUrls: ['./consent.component.scss']
})
export class ConsentComponent {
     processing: boolean = false;
     error: boolean = false;
     submitText: string = "Authorize";
     form: FormGroup;
     data: any = {
          app_name: "Placeholder App",
          identifier: "",
          email: "",
          app_giver: "",
          website: "",
          privacy_policy: "",
          catalogued_at: ""
     }
     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     constructor(private cd: ChangeDetectorRef,
                 public authService: AuthService,
                 public router: Router,
                 private fb: FormBuilder,
                 private data_app: DataService,
                 private route: ActivatedRoute) {

          this.form = this.fb.group({}, {updateOn: "blur"});

          this.authService.showSidebar = false;
          console.log(this.data_app.login_params);
     }

     authorize() {
          this.error = false;
          this.processing = true;
          this.submitText = 'Authorizing..';
          this.authService.putConsent(this.data_app.login_params.client_id).subscribe(() => {
                    let redirect = "";
                    this.router.navigateByUrl(redirect);
               },
               (error) => {
                    this.processing = false;
                    this.submitText = "Authorize";
                    // console.log(error);
                    this.error = true;
                    this.cd.markForCheck();
                 }
          );
     }
}