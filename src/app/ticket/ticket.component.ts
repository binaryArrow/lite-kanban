import {Component, Input} from '@angular/core';
import {TicketModel} from "../../models/TicketModel";
import {CdkDrag} from "@angular/cdk/drag-drop";

@Component({
  selector: 'ticket',
  standalone: true,
  imports: [
    CdkDrag
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {
  @Input() ticketModel: TicketModel = {} as TicketModel


}
