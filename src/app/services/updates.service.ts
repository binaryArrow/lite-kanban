import {ApplicationRef, inject, Injectable} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {concat, first, interval} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UpdatesService {
  private appRef = inject(ApplicationRef);
  private updates = inject(SwUpdate);

  constructor() {
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable));
    const everySixHours$ = interval(1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.updates.checkForUpdate();
        if (updateFound && confirm('A new version is available. Update now?')) {
          window.location.reload();
        }
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }
}
