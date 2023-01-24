import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { TurmasService } from '../turmas/turma.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css']
})
export class NotificacoesComponent {
  notificacoes:
    | {
      _id: string;
      usuarioId: string;
      mudancaId: {
        dataCaptura: Date;
        ocupadas: number;
        turmaId: {
          nomeDisciplina: string;
          professor: string;
          vagasOcupadas: number;
          vagasTotal: number;
        }
        _id: string;
      }
      dataDisparo: number;
      lida: boolean;
    }[]
    | null

  isLoading = false
  userIsAuthenticated = false;
  userId: string;

  private authStatusSub: Subscription;
  private notificacoesSub: Subscription;

  constructor(private authService: AuthService, public turmasService: TurmasService) { }

  formatDate(dateString: Date) {
    let date = new Date(dateString);
    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();
    let hour = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hour}:${minutes}`;
  }

  ngOnInit() {
    this.isLoading = true

    this.userId = this.authService.getUserId()

    this.turmasService.getNotificacoes(this.userId)
    this.notificacoesSub = this.turmasService.getNotificacaoUpdateListener().subscribe((data) => {
      this.notificacoes = data.notificacoes.sort((a, b) => (a.dataDisparo < b.dataDisparo) ? 1 : -1);
    })

    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated
      this.userId = this.authService.getUserId()
    })

    this.isLoading = false
  }
}
