import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {BoardComponent} from "../board/board.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBars, faPencil, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {DbService} from "../services/DbService";
import {ProjectModel} from "../../models/ProjectModel";
import {NgForOf, NgIf} from "@angular/common";
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
    FormsModule,
    NgIf
  ],
  providers: [DbService],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.scss'
})
export class MenuSidebarComponent implements OnInit {
  @ViewChild('projectTitleInput') projectTitleInput!: ElementRef<HTMLInputElement>
  @ViewChild('sidenav') sidenav!: MatSidenav
  protected readonly faBars = faBars;
  protected readonly faTrash = faTrash;
  protected readonly faPencil = faPencil;
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

  editProjectTitle() {
    this.projectTitleInput.nativeElement.disabled = false
    this.projectTitleInput.nativeElement.focus()
  }

  projectTitleChanged() {
    this.dbService.putProject(this.selectedProject).then(() => {
      this.projectTitleInput.nativeElement.disabled = true
    })
  }

  async selectProject(project: ProjectModel) {
    this.selectedProject = project
    this.containers = await this.dbService.getAllTicketContainers(this.selectedProject.id)
    this.sidenav.toggle(false)
  }

  protected readonly faPlus = faPlus;

  addNewProject() {
    this.dbService.addNewProject().then(res => {
      if (res) {
        this.projects.push(res)
        this.selectProject(res)
      }
    })
  }


  deleteProject() {
    if (confirm('Are you sure you want to delete this project?')) {
      this.dbService.deleteProject(this.selectedProject.id).then(() => {
        this.projects = this.projects.filter(project => project.id !== this.selectedProject.id)
        this.selectProject(this.projects[0])
      })
    }
  }
}
