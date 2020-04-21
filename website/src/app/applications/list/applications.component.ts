import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApplicationsGQL, Application, QueryApplicationsArgs } from '../../../generated/graphql';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
     processing : Boolean = false;
     applications: Observable<any>;
     menu: {};

     constructor(public authService: AuthService,
                 private cd : ChangeDetectorRef,
                 public apps : ApplicationsGQL,
                 public router: Router,
                 private data_app: DataService) {
          this.authService.showSidebar = true;

          this.menu = {
               buttons: [
                    { text: "Add", visible: true } 
                    ]
               };
     }

     sortByName(a,b) {
          if (a.name < b.name)
               return -1;
          if (a.name > b.name)
               return 1;
          return 0;
     }

     ngOnInit() {
          this.processing = true;
          var args: QueryApplicationsArgs = { filter_input: { } };
          this.applications = this.apps.watch(args).valueChanges.pipe(
                    map(result => result.data.applications.sort(this.sortByName)),
                    tap((data) => console.log("aaaa values updating", data)),
                    tap(() => this.cd.markForCheck()),
                    tap(() => this.processing = false),
                    finalize(() => { this.processing = false })
               );

               // this.apps.watch(
     }

     menuitem_clicked(item) {
          console.log(item);
          this.router.navigateByUrl("/application");
     }

     openApp(application) {
          this.router.navigateByUrl("/application?id=" + application.id);
     }

     getInitials(application) {
          return application.name.split(" ").map((n)=>n[0]).join("")
     }
     // this.data_app.Application_add();
}