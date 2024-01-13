import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {BoardComponent} from "../board/board.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBars, faPencil} from "@fortawesome/free-solid-svg-icons";
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {DbService} from "../services/DbService";
import {ProjectModel} from "../../models/ProjectModel";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'menu-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    BoardComponent,
    FaIconComponent,
    NgForOf,
    FormsModule
  ],
  providers: [DbService],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.scss'
})
export class MenuSidebarComponent implements OnInit {
  @ViewChild('projectTitleInput') projectTitleInput!: ElementRef<HTMLInputElement>
  @ViewChild('sidenav') sidenav!: MatSidenav
  protected readonly faBars = faBars;
  private dbService: DbService;
  containers: TicketContainerModel[] = []
  projects: ProjectModel[] = []
  selectedProject: ProjectModel = {id: 0, title: ''}

  constructor(dbService: DbService) {
    this.dbService = dbService
  }

  async ngOnInit() {
    await this.dbService.initDB()
    this.projects = await this.dbService.getAllProjects()
    this.selectedProject = this.projects[0]
    this.containers = await this.dbService.getAllTicketContainers(this.selectedProject.id)
  }

  protected readonly faPencil = faPencil;

  editProjectTitle() {
    this.projectTitleInput.nativeElement.disabled = false
    this.projectTitleInput.nativeElement.focus()
  }

  projectTitleChanged() {
    this.dbService.putProject(this.selectedProject).then(() => {
      this.projectTitleInput.nativeElement.disabled = true
    })
  }

  selectProject(project: ProjectModel) {
    this.selectedProject = project
    this.sidenav.toggle(false)
  }
}
