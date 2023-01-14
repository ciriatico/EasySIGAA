import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Turma } from '../turma.model';
import { PageEvent } from '@angular/material/paginator';
import { TurmasService } from '../turma.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Monitorada } from '../monitorada.model';

@Component({
  selector: 'app-turma-list',
  templateUrl: './turma-list.component.html',
  styleUrls: ['./turma-list.component.css'],
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
          this.isLoading = false;
        });
    }

    this.turmasService.getTurmas(this.turmasPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.turmasSub = this.turmasService
      .getTurmaUpdateListener()
      .subscribe((turmaData: { turmas: Turma[]; turmaCount: number }) => {
        this.turmas = turmaData.turmas;
        this.totalTurmas = turmaData.turmaCount;
        this.isLoading = false;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.turmasPerPage = pageData.pageSize;
    this.turmasService.getTurmas(this.turmasPerPage, this.currentPage);
  }

  onMonitorar(turmaId: string) {
    this.isLoading = true;
    this.turmasService.monitorarTurma(turmaId).subscribe(() => {
      this.turmasService.getTurmas(this.turmasPerPage, this.currentPage);
      this.monitoradas = this.turmasService.getTurmasMonitoradas(false);
    });
  }

  onDelete(turmaId: string) {
    this.isLoading = true;
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
}
