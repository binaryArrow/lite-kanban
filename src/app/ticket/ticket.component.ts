import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TicketModel} from "../../models/TicketModel";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'ticket',
  standalone: true,
  imports: [
    CdkDrag,
    FormsModule
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {
  @Input() ticketModel: TicketModel = {} as TicketModel
  @Output() showModalEvent = new EventEmitter<{show: boolean, ticketId: number}>()
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>

  showModal(){
    this.showModalEvent.emit({show: true, ticketId: this.ticketModel.id})
  }

}
