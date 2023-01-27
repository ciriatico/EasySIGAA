import { Component, OnInit } from "@angular/core";
import { ConfiguracoesService } from "./configuracoes.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-configuracoes",
  templateUrl: "./configuracoes.component.html",
  styleUrls: ["./configuracoes.component.css"],
})
export class ConfiguracoesComponent implements OnInit {
  isLoading: boolean;
  ativarNotificacoes: boolean;
  maxNotificacoes: number;
  userId: string;
  userName: string;
  userEmail: string;

  constructor(
    private configService: ConfiguracoesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.configService.getConfiguracoes().subscribe((data) => {
      this.ativarNotificacoes = !data.usuario.receberNot;
      this.maxNotificacoes = data.usuario.maxNot;
      this.userId = data.usuario._id;
      this.userName = data.usuario.nome;
      this.userEmail = data.usuario.email;
    });

    this.isLoading = false;
  }

  salvarConfiguracoes() {
    this.configService
      .saveConfiguracoes(
        !this.ativarNotificacoes,
        this.maxNotificacoes,
        this.userName,
        this.userEmail
      )
      .subscribe((result) => {
        this.router.navigate(["/"]);
      });
  }
}
