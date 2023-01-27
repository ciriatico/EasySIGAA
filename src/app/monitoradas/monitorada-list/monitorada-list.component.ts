import { Component, OnDestroy, OnInit } from "@angular/core";
import { ConnectableObservable, Subscription } from "rxjs";

import { Turma } from "../../turmas/turma.model";
import { PageEvent } from "@angular/material/paginator";
import { TurmasService } from "../../turmas/turma.service";
import { MonitoradaService } from "../../monitoradas/monitorada-list/monitorada-list.service";
import { AuthService } from "src/app/auth/auth.service";
import { Monitorada } from "../../turmas/monitorada.model";
import { CanvasJS } from "src/assets/canvasjs.angular.component";

@Component({
  selector: "app-monitorada-list",
  templateUrl: "./monitorada-list.component.html",
  styleUrls: ["./monitorada-list.component.css"],
})
export class MonitoradaListComponent implements OnInit, OnDestroy {
  date = new Date();
  dps = [{ x: new Date(), y: 0 }];
  chart: any;
  showChart = false;

  historicoTurma:
    | {
        data: number;
        vagas: number;
      }[]
    | null;

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
    public monitoradaService: MonitoradaService,
    private authService: AuthService
  ) {}

  chartOptions = {
    title: {
      text: "",
    },
    axisX: {
      valueFormatString: "DD/MM/YY  HH:mm",        // -> 26/01/23 20:50
      // valueFormatString: "DD-MM",              // -> 26-01
      // valueFormatString: "hh:mm",              // -> 20:50
      // valueFormatString: "DD MMMM hh:mm",      // -> 26 January 09:50
      labelAngle: -50,
    },
    axisY:{
      gridDashType: "dot",
      gridThickness: 1,
      gridColor: "#3535358f"
    },
    data: [
      {
        type: "area",
        color: "#5c68aa",
        dataPoints: this.dps
      },
    ],
  };

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

  async atualizaHistorico(turmaId: string) {
    await this.monitoradaService
      .getHistoricoMudancas(this.authService.getUserId(), turmaId)
      .subscribe((datas) => {
        this.historicoTurma = [];
        datas.mudancas.forEach((mudanca) => {
          this.historicoTurma!.push({
            data: mudanca.dataCaptura,
            vagas: mudanca.ocupadas,
          });
        });
      });
  }

  updateChart(turmaId: string, disciplinNome: string) {
    console.log(turmaId)
    console.log(disciplinNome)
    this.showChart = true;
    this.dps = [];
    this.atualizaHistorico(turmaId);
    this.historicoTurma?.forEach((mudanca) => {
      this.dps.push({ x: new Date(mudanca.data), y: mudanca.vagas });
    });
    this.chartOptions.title.text = disciplinNome;
    this.chart.data[0].set("dataPoints", this.dps);
    this.chart.render();
  }

  getChartInstance(chart: object) {
    this.chart = chart;
    this.chart.render();
  }
}
