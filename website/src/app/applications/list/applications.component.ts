import { DataService } from '../../data.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
     processing : Boolean = false;
     applications: Observable<any>;

     constructor(public router: Router, private data_app: DataService) { }

     ngOnInit() {
          this.processing = true;
          this.applications = this.data_app.getApplications()
               .pipe(
                    map(result => result.data.applications),
                    tap(() => this.processing = false),
                    finalize(() => { this.processing = false })
               )
     }

     openApp(application) {
          this.router.navigateByUrl("/application?id=" + application.id);
     }

     getInitials(application) {
          return application.name.split(" ").map((n)=>n[0]).join("")
     }
     // this.data_app.Application_add();
}