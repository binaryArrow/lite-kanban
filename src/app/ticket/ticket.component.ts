import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TicketModel} from "../../models/TicketModel";
import {FormsModule} from "@angular/forms";
import {SeverityConfig} from "../../models/ConfigModel";

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
  @Input() severities: SeverityConfig[] = []
  @Output() showModalEvent = new EventEmitter<{ show: boolean, ticketId: number }>()

  get severityIndicator() {
    const severity = this.severities.filter(severity => severity.name === this.ticketModel.severity)[0]
    return severity ? `background-color: ${severity.color}` : ''
  }

  showModal() {
    this.showModalEvent.emit({show: true, ticketId: this.ticketModel.id})
  }

}
