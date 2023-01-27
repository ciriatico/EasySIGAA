import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { TurmasService } from "../turmas/turma.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  qtdNotificacoes: number;
  private qtdNotificacoesSub: Subscription;

  constructor(
    private authService: AuthService,
    private turmasService: TurmasService
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        if (this.userIsAuthenticated) {
          this.qtdNotificacoesSub = this.turmasService
            .getQtdNotificacaoUpdateListener()
            .subscribe((data) => {
              this.qtdNotificacoes = data.dec
                ? this.qtdNotificacoes - 1
                : data.qtdNotificacoes;
            });
          this.turmasService.getQtdNotificacoes();
        }
      });

    if (this.userIsAuthenticated) {
      this.qtdNotificacoesSub = this.turmasService
        .getQtdNotificacaoUpdateListener()
        .subscribe((data) => {
          this.qtdNotificacoes = data.dec
            ? this.qtdNotificacoes - 1
            : data.qtdNotificacoes;
        });
      this.turmasService.getQtdNotificacoes();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.qtdNotificacoesSub.unsubscribe();
  }
}
