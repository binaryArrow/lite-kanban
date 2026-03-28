import {Component, ElementRef, input, output, viewChild} from "@angular/core";

@Component({
  selector: "confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
})
export class ConfirmationDialogComponent {
  header = input("Are you sure?");
  confirmed = output();
  cancelled = output();
  dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog");

  open() {
    this.dialog().nativeElement.showModal();
  }

  close() {
    this.dialog().nativeElement.close();
  }

  onConfirm() {
    this.confirmed.emit();
    this.close();
  }

  onCancel() {
    this.cancelled.emit();
    this.close();
  }

  closeDialogWithClickOutside(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) {
      this.onCancel();
    }
  }
}

