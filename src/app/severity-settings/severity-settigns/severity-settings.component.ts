import {
  Component,
  effect,
  ElementRef,
  inject,
  model,
  viewChild,
} from '@angular/core';
import {DbService} from "../../services/db.service";
import {SeverityConfig} from "../../../models/ConfigModel";

@Component({
  selector: 'app-severity-settigns',
  imports: [],
  templateUrl: './severity-settings.component.html',
  styleUrl: './severity-settings.component.css',
})
export class SeveritySettingsComponent {
  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  open = model(false);
  dbService = inject(DbService);

  constructor() {
    effect(() => {
      const dialog = this.dialogRef().nativeElement;
      if (this.open()) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    });
  }

  onDialogClick(event: MouseEvent) {
    if (event.target === this.dialogRef().nativeElement) {
      this.open.set(false);
    }
  }
  onColorPicked(event: Event, changedSeverity: SeverityConfig) {
    const input = event.target as HTMLInputElement;
    const updatedSeverities = this.dbService.severities().map(severity =>
      severity.name === changedSeverity.name ? {...severity, color: input.value} : severity
    );
    this.dbService.putSeverityConfigs(updatedSeverities);
  }
}
