import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {TicketModel} from "../../models/TicketModel";
import {FormsModule} from "@angular/forms";
import { DbService } from "../services/db.service";

@Component({
  selector: 'ticket',
  imports: [
    FormsModule,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  @Input() ticketModel: TicketModel = {} as TicketModel
  @Output() showModalEvent = new EventEmitter<{ show: boolean, ticketId: number }>()
  dbService = inject(DbService)

  get severityIndicator() {
    const severity = this.dbService.severities().filter(severity => severity.name === this.ticketModel.severity)[0]
    return severity ? `background-color: ${severity.color}` : ''
  }

  showModal() {
    this.showModalEvent.emit({show: true, ticketId: this.ticketModel.id})
  }

}
