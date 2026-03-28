import {Component, ElementRef, inject, input, linkedSignal, OnInit, signal, viewChild} from "@angular/core";
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {TicketModel} from "../../models/TicketModel";
import {DbService} from "../services/db.service";
import {
  faEllipsisV,
  faPlus,
  faTrash,
  faFileUpload,
  faArrowLeft,
  faArrowRight, faGear,
} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {TicketComponent} from "../ticket/ticket.component";
import {MatMenuModule} from "@angular/material/menu";
import {ImageModel} from "../../models/ImageModel";
import {BoardService} from "../services/board.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {SeveritySettingsComponent} from "../severity-settings/severity-settigns/severity-settings.component";

@Component({
  selector: "ticket-container",
  imports: [
    CdkDropList,
    CdkDrag,
    FaIconComponent,
    FormsModule,
    MatInputModule,
    TicketComponent,
    MatMenuModule,
    ConfirmationDialogComponent,
    SeveritySettingsComponent,
  ],
  templateUrl: "./ticket-container.component.html",
  styleUrl: "./ticket-container.component.css",
})
export class TicketContainerComponent implements OnInit {
  ticketContainers = input<TicketContainerModel[]>([]);
  model = input<TicketContainerModel>({
    title: "NEW",
    id: 0,
    projectId: 0,
    order: 0,
  });
  titleInput = viewChild.required<ElementRef<HTMLInputElement>>("titleInput");
  ticketModal = viewChild.required<ElementRef<HTMLDialogElement>>("ticketModal");
  deleteContainerDialog = viewChild.required<ConfirmationDialogComponent>("deleteContainerDialog");
  deleteImageDialog = viewChild.required<ConfirmationDialogComponent>("deleteImageDialog");
  clearTicketsDialog = viewChild.required<ConfirmationDialogComponent>("clearTicketsDialog");
  ticketTitleInput = viewChild.required<ElementRef<HTMLInputElement>>("ticketTitleInput");
  fileUpload = viewChild.required<ElementRef<HTMLInputElement>>("imageUpload");

  protected readonly faPlus = faPlus;
  protected readonly faEllipsisV = faEllipsisV;
  protected readonly faTrash = faTrash;
  protected readonly faFileUpload = faFileUpload;
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faArrowRight = faArrowRight;
  protected readonly faGear = faGear;
  protected showConfirmation = signal(false);
  tickets = signal<TicketModel[]>([]);
  openTicket = signal<TicketModel | undefined>(undefined);
  containerTitle = linkedSignal(() => this.model().title);
  openTicketTitle = linkedSignal(() => this.openTicket()?.title ?? '');
  openTicketDescription = linkedSignal(() => this.openTicket()?.description ?? '');
  openTicketSeverity = linkedSignal(() => this.openTicket()?.severity ?? '');
  imageData = signal<ImageModel[]>([]);
  deleteImageId = signal(0);
  openSeveritySettings = signal(false);

  dbService = inject(DbService);
  boardService = inject(BoardService);

  async ngOnInit() {
    const tickets = await this.dbService.getTicketsForContainer(this.model().id);
    tickets.sort((a, b) => a.index - b.index);
    this.tickets.set(tickets);
  }

  async showModal(event: { show: boolean; ticketId: number }) {
    if (event.show) {
      this.openTicket.set(this.tickets().find(
        (ticket) => ticket.id === event.ticketId,
      ));
      await this.setImages(event.ticketId);
      this.ticketModal().nativeElement.showModal();
      this.ticketTitleInput().nativeElement.blur();
    }
  }

  drop(event: CdkDragDrop<TicketModel[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    // Trigger signal update after CDK mutation
    this.tickets.update(ticket => [...ticket]);
    this.tickets().forEach(async (ticket, index) => {
      ticket.index = index;
      ticket.containerId = this.model().id;
      await this.dbService.putTicket(ticket);
    });
  }

  addNewTicket() {
    this.dbService
      .addNewTicket(this.model().id, this.tickets().length)
      .then(async (response) => {
        const newTicket = response as TicketModel;
        this.tickets.update(tickets => {
          const updated = [newTicket, ...tickets];
          updated.forEach((ticket, index) => ticket.index = index);
          return updated;
        });
        for (let i = 1; i < this.tickets().length; i++) {
          await this.dbService.putTicket(this.tickets()[i]);
        }
        await this.showModal({show: true, ticketId: newTicket.id});
      });
  }

  modelChanged() {
    const updatedModel = {...this.model(), title: this.containerTitle()};
    this.boardService.containers.update(containers =>
      containers.map(container => container.id === updatedModel.id ? updatedModel : container).sort((a, b) => a.order - b.order)
    );
    this.dbService.putTicketContainer(updatedModel).then();
    this.titleInput().nativeElement.blur();
  }

  saveTicket() {
    const ticket = this.openTicket();
    if (ticket) {
      const updated: TicketModel = {
        ...ticket,
        title: this.openTicketTitle(),
        description: this.openTicketDescription(),
        severity: this.openTicketSeverity(),
      };
      this.openTicket.set(updated);
      this.tickets.update(tickets => tickets.map(t => t.id === updated.id ? updated : t));
      this.dbService.putTicket(updated).then();
    }
  }

  closeTicketModal() {
    this.ticketModal().nativeElement.close();
    this.showConfirmation.set(false);
  }

  deleteTicket() {
    const ticket = this.openTicket();
    if (ticket) {
      const foundInTickets = this.tickets().find(
        (t) => t.id === ticket.id,
      );
      if (foundInTickets) {
        this.dbService.deleteTicket(ticket.id).then(() => {
          this.tickets.update(tickets => tickets.filter(t => t.id !== foundInTickets.id));
          this.closeTicketModal();
        });
      }
    }
  }

  showContainerDeleteConfirmation() {
    this.deleteContainerDialog().open();
  }

  showImageDeleteConfirmation(id: number) {
    this.deleteImageId.set(id);
    this.deleteImageDialog().open();
  }

  protected showClearTicketsConfirmation() {
    this.clearTicketsDialog().open();
  }

  async clearTickets() {
    for (const ticket of this.tickets()) {
      await this.dbService.deleteTicket(ticket.id);
    }
    this.tickets.set([]);
  }

  async deleteContainer() {
    this.dbService.deleteTicketContainer(this.model().id).then(() => {
      this.boardService.containers.update(containers =>
        containers.filter(container => container.id !== this.model().id)
      );
    });
  }

  closeDialogWithClickOutside(event: MouseEvent, element: HTMLDialogElement) {
    if (event.target === element) {
      element.close();
    }
  }

  triggerImageUpload() {
    this.fileUpload().nativeElement.click();
  }

  uploadImage() {
    const files = this.fileUpload().nativeElement.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
          this.dbService
            .addNewImage(reader.result!!.toString(), this.openTicket()!!.id)
            .then(async () => {
              await this.setImages(this.openTicket()!!.id);
            });
        };
      }
      this.fileUpload().nativeElement.value = "";
    }
  }

  async base64toBlob(base64string: string): Promise<Blob> {
    return await (await fetch(base64string)).blob();
  }

  async setImages(ticketId: number) {
    const images = await this.dbService.getAllImagesFromTickets(ticketId);
    if (images.length > 0) {
      images.forEach((image) => {
        this.base64toBlob(image.imageBase64String).then((res) => {
          image.imageURL = URL.createObjectURL(res);
        });
      });
      this.imageData.set(images);
    } else {
      this.imageData.set([]);
    }
  }

  openImage(imageUrl: string) {
    window.open(imageUrl);
  }

  deleteImage() {
    this.dbService.deleteImage(this.deleteImageId()).then(async () => {
      this.imageData.update(images =>
        images.filter((image) => image.id !== this.deleteImageId())
      );
    });
  }
}
