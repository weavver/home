import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeavverFormService {
     node_set:Subject<{}> = new Subject();
     node_updated:Subject<{}> = new Subject();
     node_delete:Subject<{}> = new Subject();
     form_state:Subject<{}> = new Subject();
     processing:Subject<Boolean> = new Subject();

     constructor() { }

     public Test() {
          console.log("test service");
     }
}