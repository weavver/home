import { DataService } from '../data.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit {
     identities: Observable<any>;

     constructor(private data_app: DataService) { }


     ngOnInit() {
          this.identities = this.data_app.getApplications()
               .pipe(
                    map(result => result.data.identities)
                  );

          this.data_app.Application_add();
     }

}