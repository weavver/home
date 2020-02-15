import { DataService } from '../../data.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
     FormGroup,
     FormBuilder,
     Validators,
     FormControl
} from '@angular/forms';
  
import { AuthService } from '../auth.service';

@Component({
     selector: 'app-signup-confirm',
     templateUrl: './signup-confirm.component.html',
     styleUrls: ['./signup-confirm.component.scss']
})
export class SignUpConfirmComponent {
     processing: boolean = false;
     form: FormGroup;
     errors: any;
     confirmText: string = "Confirm";

     get code() {   return this.form.get('code'); }

     constructor(   private cd: ChangeDetectorRef, 
                    public dataService: DataService,
                    public authService: AuthService,
                    public router: Router,
                    private fb: FormBuilder) {
          this.form = this.fb.group({
               code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)])
          });
     }

     errorGet(obj) {
          return Object.keys(obj)[0];
     }

     confirm() {
          this.errors = [];
          this.processing = true;
          this.confirmText = 'Validating code...';
          if (this.form.valid) {
               console.log('submitting form..');
               this.dataService.identityVerifyCodePut(this.code.value)
                    .subscribe(
                    (resp) => {
                         this.router.navigate(["/signup/confirm"]);
                    },
                    (err) => {
                         console.log(err);
                         this.errors = err;
                         this.processing = false;
                         this.cd.detectChanges();
                    });
          }
        else {
            console.log('not valid');
        }
     }
}