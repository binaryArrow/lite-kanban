import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {BoardComponent} from "../board/board.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBars, faBug, faPencil, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {DbService} from "../services/db.service";
import {ProjectModel} from "../../models/ProjectModel";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BoardService} from "../services/board.service";

@Component({
  selector: 'menu-sidebar',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
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
  protected readonly faGithub = faGithub;
  protected readonly faBug = faBug;

  constructor(private dbService: DbService, public boardService: BoardService) {
  }

  async ngOnInit() {
    await this.dbService.initDB()
    this.boardService.projects = await this.dbService.getAllProjects()
    this.boardService.selectedProject = this.boardService.projects[0]
    this.boardService.containers = await this.dbService.getAllTicketContainers(this.boardService.selectedProject.id)
  }

  editProjectTitle() {
    this.projectTitleInput.nativeElement.disabled = false
    this.projectTitleInput.nativeElement.focus()
  }

  projectTitleChanged() {
    this.dbService.putProject(this.boardService.selectedProject).then(() => {
      this.projectTitleInput.nativeElement.disabled = true
    })
  }

  async selectProject(project: ProjectModel) {
    this.boardService.selectedProject = project
    this.boardService.containers = await this.dbService.getAllTicketContainers(this.boardService.selectedProject.id)
    this.sidenav.toggle(false)
  }

  protected readonly faPlus = faPlus;

  addNewProject() {
    this.dbService.addNewProject().then(res => {
      if (res) {
        this.boardService.projects.push(res)
        this.selectProject(res)
      }
    })
  }


  deleteProject() {
    if (confirm('Are you sure you want to delete this project?')) {
      this.dbService.deleteProject(this.boardService.selectedProject.id).then(() => {
        this.boardService.projects = this.boardService.projects.filter(project => project.id !== this.boardService.selectedProject.id)
        this.selectProject(this.boardService.projects[0])
      })
    }
  }
}
