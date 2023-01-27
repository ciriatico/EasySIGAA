import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { MonitoradaListComponent } from './monitoradas/monitorada-list/monitorada-list.component';
import { NotificacoesComponent } from './notificacoes/notificacoes.component';
import { TurmaListComponent } from './turmas/turma-list/turma-list.component';


const routes: Routes = [
  { path: 'disciplinas', component: TurmaListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'monitor', component: MonitoradaListComponent },
  { path: 'notificacoes', component: NotificacoesComponent },
  { path: 'configuracoes', component: ConfiguracoesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
