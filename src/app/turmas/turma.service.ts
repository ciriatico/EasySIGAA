import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Turma } from './turma.model';
import { Router } from '@angular/router';
import { Monitorada } from './monitorada.model';

@Injectable({ providedIn: 'root' })
export class TurmasService {
  private turmas: Turma[] = [];
  private monitoradas: Monitorada[] = [];
  private turmasUpdated = new Subject<{
    turmas: Turma[];
    turmaCount: number;
  }>();
  private monitoradasUpdated = new Subject<{ monitoradas: Monitorada[] }>();

  constructor(private http: HttpClient, private router: Router) { }

  getTurmas() {
    return this.http
    .get<{
      message: string;
      turmas: {
        _id: string;
        turma: number;
        periodo: string;
        professor: string;
        horario: string;
        vagas_ocupadas: number;
        vagas_total: number;
        local: string;
        cod_disciplina: string;
        cod_unico_disciplina: number;
        cod_depto: number;
        nome_disciplina: string;
      }[];
      maxTurmas: number;
    }>('http://localhost:3000/api/turmas');
  }

  getDepartamentos() {
    return this.http.get<{
      message: String;
      departamentos: number[];
    }>('http://localhost:3000/api/turmas/departamentos')
  }

  getTurmaUpdateListener() {
    return this.turmasUpdated.asObservable();
  }

  getMonitoradaUpdateListener() {
    return this.monitoradasUpdated.asObservable();
  }

  monitorarTurma(turmaId: string) {
    return this.http.get<{ message: string; monitorada: any }>(
      'http://localhost:3000/api/turmas/monitorar/' + turmaId
    );
  }

  getTurmasMonitoradas(full: boolean) {
    console.log('Indooo');
    let url: string;
    if (full) {
      url = 'http://localhost:3000/api/turmas/monitoradas?full=true';
    } else {
      url = 'http://localhost:3000/api/turmas/monitoradas?full=false';
    }

    this.http.get<{ turmasMonitoradas: any }>(url).subscribe((docs) => {
      this.monitoradas = docs.turmasMonitoradas;
      this.monitoradasUpdated.next({ monitoradas: [...this.monitoradas] });
    });
  }

  deleteMonitorada(turmaId: string) {
    return this.http.delete(
      'http://localhost:3000/api/turmas/monitorar/' + turmaId
    );
  }
}
