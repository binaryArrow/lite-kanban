import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";

@Component({
  selector: "confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
})
export class ConfirmationDialogComponent {
  @Input() header: string = "Are you sure?";
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @ViewChild("dialog") dialog!: ElementRef<HTMLDialogElement>;

  open() {
    this.dialog.nativeElement.showModal();
  }

  close() {
    this.dialog.nativeElement.close();
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
    if (event.target === this.dialog.nativeElement) {
      this.onCancel();
    }
  }
}

