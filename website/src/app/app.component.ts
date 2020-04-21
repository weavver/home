import { environment } from '../environments/environment';
// import { CommonModule } from '@angular/common';  
import {
     ChangeDetectionStrategy,
     OnInit,
     Component,
     ViewChild
} from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { slideInAnimation } from "./animations";

import { AuthService } from "./auth/auth.service";
import { DataService } from './data.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
     selector: "app-root",
     changeDetection: ChangeDetectionStrategy.OnPush,
     templateUrl: "app.component.html",
     styleUrls: ["app.component.scss"],
     animations: [slideInAnimation]
})
export class AppComponent implements OnInit {
     navGeneral: boolean = false;
     navAccountExpanded: boolean = false;

     constructor(private router: Router, public authService: AuthService, public graph: DataService)
     {
     }
     
     ngOnInit() {
     }

     toggleNavAccount() {
          this.navAccountExpanded = !this.navAccountExpanded;
     }
     
     toggleNavGeneral() {
          this.navGeneral = !this.navGeneral;
     }

     logOut() {
          this.authService.logOut();
     }

     getAnimationData(outlet: RouterOutlet) {
          return (
               outlet &&
               outlet.activatedRouteData &&
               outlet.activatedRouteData["animation"]
          );
     }
}
