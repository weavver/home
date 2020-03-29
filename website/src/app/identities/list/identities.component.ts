import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map, finalize } from 'rxjs/operators';
import { Event, Router } from '@angular/router';

@Component({
     selector: 'app-identities',
     templateUrl: './identities.component.html',
     styleUrls: ['./identities.component.scss'],
     host: {
          '(window:resize)': 'onResize($event)'
     }
})
export class IdentitiesComponent implements OnInit {
     processing : Boolean = false;
     identities: Observable<any>;

     gridApi;

     columnDefs = [
               {headerName: 'Id', field: 'id', sortable: true, maxWidth: 100, filter: true },
               {
                    headerName: "Name",
                    children: [
                         {headerName: 'Given', field: 'name_given', filter: true, sortable: true },
                         {headerName: 'Family', field: 'name_family', filter: true, sortable: true }
                    ]},
               {headerName: 'Email', field: 'email' }
          ];

     constructor(private cd: ChangeDetectorRef, private graph: DataService, public router: Router) { }

     ngOnInit() {
          this.processing = true;
          this.identities = this.graph.identities()
               .pipe(
                    map(result => { 
                         return result.data.identities;
                    }),
                    tap(() => this.processing = false),
                    tap(() => {
                         if (this.gridApi) this.gridApi.sizeColumnsToFit()
                    }),
                    finalize(() => { this.processing = false })
               )
     }

     onGridReady(params) {
          this.gridApi = params.api;
          this.gridApi.sizeColumnsToFit();
     }

     onrowDoubleClickedEvent(event) {
          // console.log(event.data.id);
          this.router.navigateByUrl("/identity?id=" + event.data.id);
     }

     onGridSizeChangedEvent(event) {
     }
     
     onResize(event) {
          this.gridApi.sizeColumnsToFit();
          // event.target.innerWidth;
     }
}