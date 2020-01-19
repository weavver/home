import {
     ChangeDetectionStrategy,
     OnInit,
     Component,
     ViewChild
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { slideInAnimation } from "./animations";

import { AuthService } from "./auth/auth.service";

@Component({
     selector: "app-root",
     changeDetection: ChangeDetectionStrategy.OnPush,
     templateUrl: "app.component.html",
     styleUrls: ["app.component.scss"],
     animations: [slideInAnimation]
})
export class AppComponent {
     navGeneral: boolean = false;
     navAccountExpanded: boolean = false;

     constructor(public authService: AuthService)
     {

     }
     
     toggleNavAccount() {
          this.navAccountExpanded = !this.navAccountExpanded;
     }
     
     toggleNavGeneral() {
          this.navGeneral = !this.navGeneral;
     }


     logout() {
          this.authService.logout();
          return false;
     }

     getAnimationData(outlet: RouterOutlet) {
          return (
               outlet &&
               outlet.activatedRouteData &&
               outlet.activatedRouteData["animation"]
          );
     }
}
