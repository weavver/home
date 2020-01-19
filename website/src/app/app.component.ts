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
     constructor(public authService: AuthService) {}

     getAnimationData(outlet: RouterOutlet) {
          return (
               outlet &&
               outlet.activatedRouteData &&
               outlet.activatedRouteData["animation"]
          );
     }
}
