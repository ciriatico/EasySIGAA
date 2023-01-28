import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval, take, lastValueFrom } from 'rxjs';

import { Monitorada } from "./monitorada.model"
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })

export class MonitoradaService {
  constructor(private http: HttpClient, private router: Router) { }

  async getHistoricoMudancas(turmaId: string) {
    const t = this.http.get<{
      message: string;
      mudancas: Monitorada[];
    }>("http://localhost:3000/api/turmas/historico/" + turmaId)
    return await lastValueFrom(t)
  }
}