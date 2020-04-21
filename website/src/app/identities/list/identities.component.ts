import { DataService } from '../../data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map, finalize } from 'rxjs/operators';
import { Event, Router } from '@angular/router';
import { IdentitiesGQL, QueryIdentitiesArgs } from '../../../generated/graphql';

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
     menu: {};

     gridApi;

     columnDefs = [
               {headerName: 'Id', field: 'id', sortable: true, minWidth: 60, maxWidth: 100, filter: true },
               {
                    headerName: "Name",
                    children: [
                         {headerName: 'Given', field: 'name_given', filter: true, sortable: true },
                         {headerName: 'Family', field: 'name_family', filter: true, sortable: true }
                    ]},
               {headerName: 'Email', field: 'email' }
          ];

     constructor(private cd: ChangeDetectorRef,
                 public identitiesg : IdentitiesGQL,
                 private graph: DataService,
                 public router: Router) {
          this.menu = {
               buttons: [
                    { text: "Add", visible: true } 
                    ]
               };
     }

     ngOnInit() {
          this.processing = true;
          var filter : QueryIdentitiesArgs = {
               filter_input: { }
          }
          this.identities = this.identitiesg.watch(filter).valueChanges.pipe(
                    map(result => result.data.identities),
                    tap(() => this.processing = false),
                    tap(() => {
                         if (this.gridApi) this.gridApi.sizeColumnsToFit()
                    }),
                    finalize(() => { this.processing = false })
               );
     }

     menuitem_clicked(item) {
          console.log(item);
          this.router.navigateByUrl("/identity?id=new");
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