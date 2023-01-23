import { Router } from '@angular/router';
import { AccountService } from './../account/account-service.service';
import { SignUpService } from './../signUp/sign-up.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(
    private route: Router,
    private accountService: AccountService,
    private upService: SignUpService
  ) {}

  login(email: string, password: string) {
    this.upService.usuarios.forEach((u) => {
      if (u.email === email && u.senha === password) {
        this.accountService.usuario = u;
        this.route.navigate(['dashboard'])
        return;
      }
    });
  }
}
