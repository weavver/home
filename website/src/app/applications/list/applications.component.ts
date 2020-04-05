import { DataService } from '../../data.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApplicationsGQL, Application, QueryApplicationsArgs } from '../../../generated/graphql';

@Component({
  selector: 'applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
     processing : Boolean = false;
     applications: Observable<any>;
     menu: {};

     constructor(public apps : ApplicationsGQL, public router: Router, private data_app: DataService) {
          this.menu = {
               buttons: [
                    { text: "Add" } 
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
          var args: QueryApplicationsArgs = { filter_input: { limit: 10 } };
          this.applications = this.apps.watch(args).valueChanges.pipe(
                    map(result => result.data.applications.sort(this.sortByName)),
                    tap(() => this.processing = false),
                    finalize(() => { this.processing = false })
               );
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