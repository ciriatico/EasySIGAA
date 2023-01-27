import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Monitorada } from "./monitorada.model"
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })

export class MonitoradaService {
  constructor(private http: HttpClient, private router: Router) { }

  getHistoricoMudancas(usuarioId: string, turmaId: string) {
    return this.http.get<{
        message: string;
        mudancas: Monitorada[];
      }>("http://localhost:3000/api/turmas/historico/" + turmaId);
  }
}