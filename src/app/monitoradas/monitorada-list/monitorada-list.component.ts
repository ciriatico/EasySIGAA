import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { lastValueFrom, Subscription } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTable } from "@angular/material/table";

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
  displayedColumns: string[] = ["disciplina", "vagas", "acoes"];
  date = new Date();
  dps = [{ x: new Date(), y: 0 }];
  chart: any;
  showChart = false;
  dataSource: MatTableDataSource<Turma>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("tabelaDisciplinas") table: MatTable<any>;

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
      text: "Selecione alguma turma",
      fontFamily: "Roboto",
      fontStyle: "500",
    },
    subtitles: [
      {
        text: "",
        fontFamily: "Roboto",
        fontStyle: "normal",
      },
    ],
    zoomEnabled: true,
    axisX: {
      valueFormatString: "DD/MM/YY  HH:mm", // -> 26/01/23 20:50
      // valueFormatString: "DD-MM",              // -> 26-01
      // valueFormatString: "hh:mm",              // -> 20:50
      // valueFormatString: "DD MMMM hh:mm",      // -> 26 January 09:50
      labelAngle: -50,
    },
    axisY: {
      gridDashType: "dot",
      gridThickness: 1,
      gridColor: "#3535358f",
    },
    data: [
      {
        type: "area",
        color: "#5c68aa",
        dataPoints: this.dps,
      },
    ],
  };

  async getMonitoradas() {
    await this.turmasService.getTurmasMonitoradas(false);
  }

  async ngOnInit() {
    this.isLoading = true;
    this.turmasService.getTurmasMonitoradas(true);
    await this.getMonitoradas().then((data) => data);

    this.monitoradasSub = this.turmasService
      .getMonitoradaUpdateListener()
      .subscribe((monitoradaData: { monitoradas: Monitorada[] }) => {
        this.monitoradas = monitoradaData.monitoradas;
        this.monitoradasCod = this.monitoradas.map((value) => value.turmaId);
        this.isLoading = false;

        this.dataSource = new MatTableDataSource<Turma>(this.monitoradasCod);
        this.dataSource.paginator = this.paginator;
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
    await this.monitoradaService.getHistoricoMudancas(turmaId).then((datas) => {
      this.historicoTurma = [];
      datas!.mudancas.forEach((mudanca) => {
        this.historicoTurma!.push({
          data: mudanca.dataCaptura,
          vagas: mudanca.ocupadas,
        });
      });
    });
  }

  async updateChart(turmaId: string, disciplinNome: string) {
    this.showChart = true;
    this.dps = [];
    this.historicoTurma = [];
    await this.atualizaHistorico(turmaId).then((abobrinha) => {
      this.historicoTurma?.forEach((mudanca) => {
        this.dps.push({ x: new Date(mudanca.data), y: mudanca.vagas });
      });

      if (this.historicoTurma!.length <= 0) {
        this.chartOptions.subtitles[0].text = "Nenhuma alteração registrada.";
      } else {
        this.chartOptions.subtitles[0].text = "";
      }

      this.chartOptions.title.text = disciplinNome;
      this.chart.data[0].set("dataPoints", this.dps);
      this.chart.render();
    });
  }

  getChartInstance(chart: object) {
    this.chart = chart;
    this.chart.data[0].set("dataPoints", []);
    this.chart.render();
  }
}

export interface Turma {
  codDepto: number;
  codDisciplina: string;
  codTurma: string;
  horario: string;
  nomeDepto: string;
  nomeDisciplina: string;
  periodo: string;
  professor: string;
  vagasOcupadas: number;
  vagasTotal: number;
  _id: string;
}
