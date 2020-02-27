import { environment } from '../environments/environment';
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
     I$: Observable<any>;

     navGeneral: boolean = false;
     navAccountExpanded: boolean = false;

     constructor(private router: Router, public authService: AuthService, public graph: DataService)
     {
     }
     
     ngOnInit() {
          this.I$ = this.graph.I()
               .pipe(
                    map(result => result.data.I)
                  );
     }

     toggleNavAccount() {
          this.navAccountExpanded = !this.navAccountExpanded;
     }
     
     toggleNavGeneral() {
          this.navGeneral = !this.navGeneral;
     }

     logOut() {
          var redirect_url = environment.baseApiUrl + "/signout?redirect_url=" + environment.website_url;
          if (this.graph.login_params.redirect_url) {
               // TBD: lock this down more
               redirect_url = environment.baseApiUrl + "/signout?redirect_url=" + this.graph.login_params.redirect_url;
          }
          document.location.href = redirect_url;
     }

     getAnimationData(outlet: RouterOutlet) {
          return (
               outlet &&
               outlet.activatedRouteData &&
               outlet.activatedRouteData["animation"]
          );
     }
}
