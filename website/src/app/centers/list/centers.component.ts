import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

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
     identities: Observable<any>;

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

     constructor(private cd: ChangeDetectorRef, private graph: DataService, public router: Router) {
          this.menu = {
               buttons: [
                    { text: "Add" } 
                    ]
               };
     }

     ngOnInit() {
          this.processing = true;
          this.identities = this.graph.centers()
                    .pipe(
                         map(result => { 
                              return result.data.centers;
                         }
                    ),
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