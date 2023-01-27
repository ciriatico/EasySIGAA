import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TurmasService } from '../turmas/turma.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  qtdNotificacoes: number;
  private qtdNotificacoesSub: Subscription;


  constructor(private authService: AuthService, private turmasService: TurmasService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.reloadNotificacoes()
        this.userIsAuthenticated = isAuthenticated;
      });

    if (this.userIsAuthenticated) {
      this.turmasService.getQtdNotificacoes(this.authService.getUserId())
      this.qtdNotificacoesSub = this.turmasService.getQtdNotificacaoUpdateListener().subscribe(data => {
        this.qtdNotificacoes = data.qtdNotificacoes;
      })
    }
  }

  reloadNotificacoes() {
    if (this.userIsAuthenticated) {
      this.turmasService.getQtdNotificacoes(this.authService.getUserId())
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
