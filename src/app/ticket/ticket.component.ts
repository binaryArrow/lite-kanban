import {Component, computed, inject, input, output} from '@angular/core';
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
  ticketModel = input<TicketModel>({} as TicketModel);
  showModalEvent = output<{ show: boolean, ticketId: number }>();
  dbService = inject(DbService);

  severityIndicator = computed(() => {
    const severity = this.dbService.severities().filter(severity => severity.name === this.ticketModel().severity)[0];
    return severity ? `background-color: ${severity.color}` : '';
  });

  showModal() {
    this.showModalEvent.emit({show: true, ticketId: this.ticketModel().id});
  }

}
