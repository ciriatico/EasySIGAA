import { Component } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { TurmasService } from "../turmas/turma.service";
import { Subscription } from "rxjs";
import { Notificacao } from "../turmas/notificacao.model";
import { ThisReceiver } from "@angular/compiler";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-notificacoes",
  templateUrl: "./notificacoes.component.html",
  styleUrls: ["./notificacoes.component.css"],
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
        };
        _id: string;
      };
      dataDisparo: number;
      lida: boolean;
    }[] = []

  totalNotificacoes = 0
  notificacoesPerPage = 10
  currentPage = 1
  pageSizeOptions = [10]

  paginatedNotificacoes:
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
        };
        _id: string;
      };
      dataDisparo: number;
      lida: boolean;
    }[] = []

  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  private authStatusSub: Subscription;
  private notificacoesSub: Subscription;

  constructor(
    private authService: AuthService,
    public turmasService: TurmasService
  ) { }

  formatDate(dateString: Date) {
    let date = new Date(dateString);
    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();
    let hour = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hour}:${minutes}`;
  }

  markAsRead(notificacao: Notificacao) {
    if (!notificacao.lida) {
      notificacao.lida = true;
      let rawIndex = this.paginatedNotificacoes.indexOf(notificacao) + (this.currentPage * this.notificacoesPerPage)
      this.notificacoes[rawIndex].lida = true
      this.turmasService.marcarNotificacao(notificacao._id);
      this.turmasService.changeQtdNotificacoes(1);
    }
  }

  markAllAsRead() {
    this.turmasService.marcarNotificacoes();
    this.turmasService.changeQtdNotificacoes(0);
    this.notificacoes?.forEach((notificacao) => {
      notificacao.lida = true;
    });
    this.paginatedNotificacoes?.forEach((notificacao) => {
      notificacao.lida = true;
    })
  }

  cleanNotifications() {
    this.notificacoes = [];
    this.paginatedNotificacoes = [];
    this.turmasService.deleteNotificacoes();
    this.turmasService.getQtdNotificacoes();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.notificacoesPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex
    this.paginatedNotificacoes = this.notificacoes.slice(
      pageData.pageIndex * pageData.pageSize,
      (pageData.pageIndex + 1) * pageData.pageSize
    );
    this.isLoading = false;
  }

  ngOnInit() {
    this.isLoading = true;

    this.userId = this.authService.getUserId();

    this.turmasService.getNotificacoes();
    this.notificacoesSub = this.turmasService
      .getNotificacaoUpdateListener()
      .subscribe((data) => {
        this.notificacoes = data.notificacoes.sort((a, b) =>
          a.dataDisparo < b.dataDisparo ? 1 : -1
        );
        this.totalNotificacoes = this.notificacoes.length
        this.onChangedPage({
          pageIndex: 0,
          pageSize: this.notificacoesPerPage,
          length: this.totalNotificacoes
        })
        this.isLoading = false;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.notificacoesSub.unsubscribe();
  }
}
