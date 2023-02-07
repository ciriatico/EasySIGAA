import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const senha = form.value.senha;
    this.isLoading = true;
    this.authService
      .createUser(form.value.nome, form.value.email, form.value.senha)
      .subscribe((response: any) => {
        this.authService.login(response.result.email, senha);
      });
  }
}
