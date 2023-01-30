import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Turma } from "../turma.model";
import { PageEvent } from "@angular/material/paginator";
import { TurmasService } from "../turma.service";
import { AuthService } from "src/app/auth/auth.service";
import { Monitorada } from "../monitorada.model";

@Component({
  selector: "app-turma-list",
  templateUrl: "./turma-list.component.html",
  styleUrls: ["./turma-list.component.css"],
})
export class TurmaListComponent implements OnInit, OnDestroy {
  monitoradas: Monitorada[] | void;
  monitoradasCod: any;
  turmas: Turma[] = [];
  isLoading = false;
  totalTurmas = 0;
  turmasPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  private turmasSub: Subscription;
  private monitoradasSub: Subscription;

  departamentos: number[];
  filtroDepartamento: number;
  filtroProfessor: string;
  filtroNome: string;

  paginatedTurmas: Turma[];

  filteredTurmas: Turma[] = [];
  displayedColumns = ["disciplina", "vagasOcupadas", "vagasTotal", "monitorar"];
  constructor(
    public turmasService: TurmasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    if (this.userIsAuthenticated) {
      this.turmasService.getTurmasMonitoradas(false);
      this.monitoradasSub = this.turmasService
        .getMonitoradaUpdateListener()
        .subscribe((monitoradaData: { monitoradas: Monitorada[] }) => {
          this.monitoradas = monitoradaData.monitoradas;
          this.monitoradasCod = this.monitoradas.map((value) => value.turmaId);
          this.isLoading = this.turmas.length <= 0 ? true : false;
        });
    }

    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.turmasSub = this.turmasService.getTurmas().subscribe((data) => {
      this.turmas = data.turmas;
      this.filteredTurmas = data.turmas;
      this.totalTurmas = this.filteredTurmas.length;
      this.onChangedPage({
        pageIndex: 0,
        pageSize: this.turmasPerPage,
        length: this.totalTurmas,
      });
      this.isLoading = false;
    });

    this.turmasService.getDepartamentos().subscribe((data) => {
      this.departamentos = data.departamentos;
    });
  }

  onChangeFilter() {
    this.isLoading = true;
    this.filteredTurmas = this.turmas;
    if (this.filtroDepartamento) {
      this.filteredTurmas = this.filteredTurmas.filter(
        (turma) => turma.codDepto == this.filtroDepartamento
      );
    }

    if (this.filtroProfessor) {
      this.filteredTurmas = this.filteredTurmas.filter((turma) =>
        turma.professor
          .toLowerCase()
          .includes(this.filtroProfessor.toLowerCase())
      );
    }

    if (this.filtroNome) {
      this.filteredTurmas = this.filteredTurmas.filter((turma) =>
        turma.nomeDisciplina
          .toLowerCase()
          .includes(this.filtroNome.toLowerCase())
      );
    }

    this.totalTurmas = this.filteredTurmas.length;
    this.onChangedPage({
      pageIndex: 0,
      pageSize: this.turmasPerPage,
      length: this.totalTurmas,
    });
    this.isLoading = false;
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.turmasPerPage = pageData.pageSize;
    this.paginatedTurmas = this.filteredTurmas.slice(
      pageData.pageIndex * pageData.pageSize,
      (pageData.pageIndex + 1) * pageData.pageSize
    );
    this.isLoading = false;
  }

  onMonitorar(turmaId: string) {
    this.turmasService.monitorarTurma(turmaId).subscribe(() => {
      this.turmasService.getTurmas();
      this.monitoradas = this.turmasService.getTurmasMonitoradas(false);
    });
  }

  onDelete(turmaId: string) {
    this.turmasService.deleteMonitorada(turmaId).subscribe(() => {
      this.turmasService.getTurmasMonitoradas(false);
    });
  }

  ngOnDestroy() {
    this.turmasSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    if (this.userIsAuthenticated) {
      this.monitoradasSub.unsubscribe();
    }
  }

  isChecked(turmaId: string) {
    if (this.monitoradasCod.indexOf(turmaId) == -1) {
      return false;
    } else if (this.monitoradasCod.indexOf(turmaId) > -1) {
      return true;
    }
    return false;
  }

  onChangeMonitorar(turmaId: string) {
    if (this.monitoradasCod.indexOf(turmaId) == -1) {
      this.onMonitorar(turmaId);
    } else if (this.monitoradasCod.indexOf(turmaId) > -1) {
      this.onDelete(turmaId);
    }
  }
}
