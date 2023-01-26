import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from './usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {

  constructor(private http: HttpClient) { }


  getConfiguracoes() {
    return this.http.get<{
      message: string,
      usuario: Usuario
    }>("http://localhost:3000/api/usuario")
  }

  saveConfiguracoes(receberNot: boolean, maxNot: number, name: string, email: string) {
    this.http.put("http://localhost:3000/api/usuario/salvarConfiguracoes", { receberNot: receberNot, maxNot: maxNot, nome: name, email: email }).subscribe((data) => {
    })
  }
}
