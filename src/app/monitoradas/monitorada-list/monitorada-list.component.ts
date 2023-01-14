import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Turma } from '../../turmas/turma.model';
import { PageEvent } from '@angular/material/paginator';
import { TurmasService } from '../../turmas/turma.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Monitorada } from '../../turmas/monitorada.model';

@Component({
  selector: 'app-monitorada-list',
  templateUrl: './monitorada-list.component.html',
  styleUrls: ['./monitorada-list.component.css'],
})
export class MonitoradaListComponent implements OnInit, OnDestroy {
  monitoradas:
    | {
        _id: string;
        userId: string;
        turmaId: any;
        beginDate: Date;
      }[]
    | null;
  monitoradasCod: any;
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  private monitoradasSub: Subscription;

  constructor(
    public turmasService: TurmasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.turmasService.getTurmasMonitoradas(true);
    this.monitoradasSub = this.turmasService
      .getMonitoradaUpdateListener()
      .subscribe((monitoradaData: { monitoradas: Monitorada[] }) => {
        this.monitoradas = monitoradaData.monitoradas;
        this.monitoradasCod = this.monitoradas.map((value) => value.turmaId);
        this.isLoading = false;
      });

    this.isLoading = true;
    this.userId = this.authService.getUserId();

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(turmaId: string) {
    this.isLoading = true;
    this.turmasService.deleteMonitorada(turmaId).subscribe(() => {
      this.turmasService.getTurmasMonitoradas(true);
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.monitoradasSub.unsubscribe();
  }
}
