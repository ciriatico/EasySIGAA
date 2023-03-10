import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Turma } from "./turma.model";
import { Router } from "@angular/router";
import { Monitorada } from "./monitorada.model";
import { Notificacao } from "./notificacao.model";

@Injectable({ providedIn: "root" })
export class TurmasService {
  private turmas: Turma[] = [];
  private monitoradas: Monitorada[] = [];
  private notificacoes: Notificacao[] = [];
  private turmasUpdated = new Subject<{
    turmas: Turma[];
    turmaCount: number;
  }>();
  private qtdNotificacoes: number;
  private monitoradasUpdated = new Subject<{ monitoradas: Monitorada[] }>();
  private notificacoesUpdated = new Subject<{ notificacoes: Notificacao[] }>();
  private qtdNotificacoesUpdated = new Subject<{
    qtdNotificacoes: number;
    dec: boolean;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTurmas() {
    return this.http.get<{
      message: string;
      turmas: Turma[];
      maxTurmas: number;
    }>("http://localhost:3000/api/turmas");
  }

  getDepartamentos() {
    return this.http.get<{
      message: String;
      departamentos: number[];
    }>("http://localhost:3000/api/turmas/departamentos");
  }

  getHistoricoMudancas(turmaId: string) {
    this.http
      .get<{
        message: string;
        notificacoes: Notificacao[];
      }>("http://localhost:3000/api/turmas/historico/" + turmaId)
      .subscribe((data) => {
        this.notificacoes = data.notificacoes;
        this.notificacoesUpdated.next({ notificacoes: [...this.notificacoes] });
      });
  }

  getNotificacoes() {
    this.http
      .get<{
        message: string;
        notificacoes: Notificacao[];
      }>("http://localhost:3000/api/notificacoes")
      .subscribe((data) => {
        this.notificacoes = data.notificacoes;
        this.notificacoesUpdated.next({ notificacoes: [...this.notificacoes] });
      });
  }

  changeQtdNotificacoes(value: number) {
    this.qtdNotificacoesUpdated.next({
      qtdNotificacoes: value,
      dec: value === 1 ? true : false,
    });
  }

  getQtdNotificacoes() {
    this.http
      .get<{
        message: string;
        qtdNotificacoes: number;
      }>("http://localhost:3000/api/notificacoes/novas")
      .subscribe((data) => {
        this.qtdNotificacoes = data.qtdNotificacoes;
        this.qtdNotificacoesUpdated.next({
          qtdNotificacoes: this.qtdNotificacoes,
          dec: false,
        });
      });
  }

  marcarNotificacoes() {
    this.http
      .put("http://localhost:3000/api/notificacoes/marcarlidas", {})
      .subscribe((res) => {});
  }

  marcarNotificacao(notificacaoId: string) {
    this.http
      .put(
        "http://localhost:3000/api/notificacoes/marcarlida/" + notificacaoId,
        {}
      )
      .subscribe((res) => {});
  }

  getQtdNotificacaoUpdateListener() {
    return this.qtdNotificacoesUpdated.asObservable();
  }

  getTurmaUpdateListener() {
    return this.turmasUpdated.asObservable();
  }

  getMonitoradaUpdateListener() {
    return this.monitoradasUpdated.asObservable();
  }

  getNotificacaoUpdateListener() {
    return this.notificacoesUpdated.asObservable();
  }

  monitorarTurma(turmaId: string) {
    return this.http.get<{ message: string; monitorada: any }>(
      "http://localhost:3000/api/turmas/monitorar/" + turmaId
    );
  }

  getTurmasMonitoradas(full: boolean) {
    let url: string;
    if (full) {
      url = "http://localhost:3000/api/turmas/monitoradas?full=true";
    } else {
      url = "http://localhost:3000/api/turmas/monitoradas?full=false";
    }

    this.http.get<{ turmasMonitoradas: any }>(url).subscribe((docs) => {
      this.monitoradas = docs.turmasMonitoradas;
      this.monitoradasUpdated.next({ monitoradas: [...this.monitoradas] });
    });
  }

  deleteMonitorada(turmaId: string) {
    return this.http.delete(
      "http://localhost:3000/api/turmas/monitorar/" + turmaId
    );
  }

  deleteNotificacoes() {
    this.http
      .delete("http://localhost:3000/api/notificacoes")
      .subscribe((data) => {});
  }
}
