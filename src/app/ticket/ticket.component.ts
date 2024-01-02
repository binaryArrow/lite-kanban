import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {severities, TicketModel} from "../../models/TicketModel";
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

  get severityIndicator() {
    switch (this.ticketModel.severity) {
      case severities[1]:
        return 'background-color: #b9f167'
      case severities[2]:
        return 'background-color: #def366'
      case severities[3]:
        return 'background-color: #DEF366FF'
      case severities[4]:
        return 'background-color: #f3a566'
      case severities[5]:
        return 'background-color: #f36666'
    }
    return ''
  }

  showModal(){
    this.showModalEvent.emit({show: true, ticketId: this.ticketModel.id})
  }

}
