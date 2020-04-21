import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { tap, map, finalize, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { CentersGQL, CentersQueryVariables } from '../../../generated/graphql';

@Component({
     selector: 'centers',
     templateUrl: './centers.component.html',
     styleUrls: ['./centers.component.scss'],
     host: {
          '(window:resize)': 'onResize($event)'
     }
})
export class CentersComponent implements OnInit {
     processing : Boolean = false;
     centers: Observable<any>;

     menu : {};
     gridApi;

     columnDefs = [
               {headerName: 'Id', field: 'id', sortable: true, maxWidth: 100, filter: true },
               // {
                    // headerName: "Stats",
                    // children: [
                    //      {headerName: 'Users', field: 'name', filter: true, sortable: true },
                    // ]},
               {headerName: 'Name', field: 'name' }
          ];

     constructor(private cd: ChangeDetectorRef,
                 public centersg : CentersGQL,
                 public router: Router) {
          this.menu = {
               buttons: [
                    { text: "Add", visible: true } 
                    ]
               };
     }

     ngOnInit() {
          this.processing = true;
          var filter : CentersQueryVariables = {
               filter_input: { }
          }
          this.centers = this.centersg.watch(filter).valueChanges.pipe(
                    map(result => result.data.centers),
                    // catchError(err => of([])),
                    tap(() => this.processing = false),
                    tap(() => {
                              if (this.gridApi) this.gridApi.sizeColumnsToFit()
                         }
                    ),
                    finalize(() => { this.processing = false })
               );
     }

     menuitem_clicked(item) {
          console.log(item);
          this.router.navigateByUrl("/center");
     }

     onGridReady(params) {
          this.gridApi = params.api;
          this.gridApi.sizeColumnsToFit();
     }

     onrowDoubleClickedEvent(event) {
          // console.log(event.data.id);
          this.router.navigateByUrl("/center?id=" + event.data.id);
     }

     onGridSizeChangedEvent(event) {
     }
     
     onResize(event) {
          this.gridApi.sizeColumnsToFit();
          // event.target.innerWidth;
     }
}