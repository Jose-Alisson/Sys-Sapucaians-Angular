import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import {
  SocialUser,
  SocialAuthService,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { Injectable, Injector } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  userFromPs: Usuario = {
    id: 0,
    contato: '(81) 9 73127515',
    pedidos: [],
    enderecos: [
      {
        id: 0,
        nomeDoEndereco: 'Minha Casa',
        cep: '51345080',
        numeroDaCasa: '90',
        localidade: 'Ur3',
      },
      {
        id: 1,
        nomeDoEndereco: 'Igreja',
        cep: '51345090',
        numeroDaCasa: '47',
        localidade: 'Ur2',
      },
      {
        id: 2,
        nomeDoEndereco: 'Trabalho',
        cep: '51348906',
        numeroDaCasa: '73',
        localidade: 'Ur12',
      },
    ],
  };

  socialUser!: SocialUser /*= {
    provider: 'GOOGLE',
    id: '61256153',
    email: 'JoseAlisson@gmail.com',
    name: 'Alisson',
    photoUrl: 'http://localhost:4200/assets/iconePizzaria.png',
    firstName: 'JoSe Alisson',
    lastName: '',
    authToken: '',
    idToken: '',
    authorizationCode: '',
    response: undefined,
  };*/

  constructor(
    private http: HttpClient,
    private authService: SocialAuthService,
    private router: Router
  ) {}

  authUser() {
    return this.authService.authState.pipe(
      map((user) => {
        this.socialUser = user;
      })
    );
  }

  checkUser(): boolean {
    if (this.socialUser === undefined) {
      this.router.navigate(['account']);
      return false;
    }

    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
    });

    return true;
  }

  sair(){
    this.authService.signOut()
  }
}
