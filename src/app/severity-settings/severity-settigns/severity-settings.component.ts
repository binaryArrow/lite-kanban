import {
  Component,
  effect,
  ElementRef,
  inject,
  model,
  viewChild,
} from '@angular/core';
import {DbService} from "../../services/db.service";

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
      if (this.open() && !dialog.open) {
        dialog.showModal();
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }

  onDialogClick(event: MouseEvent) {
    if (event.target === this.dialogRef().nativeElement) {
      this.open.set(false);
    }
  }
}
