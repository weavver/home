import {
     ChangeDetectionStrategy,
     OnInit,
     Component,
     ViewChild
} from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
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

     constructor(private router: Router, public authService: AuthService)
     {
     }

     toggleNavAccount() {
          this.navAccountExpanded = !this.navAccountExpanded;
     }
     
     toggleNavGeneral() {
          this.navGeneral = !this.navGeneral;
     }

     logOut() {
          this.authService.delToken("asdf").subscribe(() => {
               console.log("logged out");
               this.router.navigate(["/login"]);
          });
     }

     getAnimationData(outlet: RouterOutlet) {
          return (
               outlet &&
               outlet.activatedRouteData &&
               outlet.activatedRouteData["animation"]
          );
     }
}
