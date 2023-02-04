import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import {
  SocialUser,
  SocialAuthService,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { Injectable, Injector } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, identity, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  private URL_API = 'https://75db-45-6-136-56.sa.ngrok.io/user';

  userFromPs!: Usuario; /*= {
    contato: '73127515',
    email: 'alissonbarbosa.9982@gmail.com',
    enderecos: [],
    id: 1,
    provedorr: 'GOOGLE',
  };*/

  socialUser!: SocialUser; /* = {
    email: 'alissonbarbosa.9982@gmail.com',
    firstName: 'Jose Alisson',
    id: '101583479341555375341',
    idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3NDA1MmEyYjY0NDg3NDU3NjRlNzJjMzU5MDk3MWQ5MGNmYjU4NWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NzUyMTA1MjgsImF1ZCI6IjQ0MzEyNTA4NTU4NS1wZmFsZjZlbXRiNmYyNWV2MzJwMHZncHRram51ZWJqcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMTU4MzQ3OTM0MTU1NTM3NTM0MSIsImVtYWlsIjoiYWxpc3NvbmJhcmJvc2EuOTk4MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiNDQzMTI1MDg1NTg1LXBmYWxmNmVtdGI2ZjI1ZXYzMnAwdmdwdGtqbnVlYmpwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6Ikpvc2UgQWxpc3NvbiBCYXJib3NhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FFZEZUcDdNM3k5SEg3dWpZV3Etc2ZOYTBnODdROEV4c0xGMHJ4UmtZTy1sPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikpvc2UgQWxpc3NvbiIsImZhbWlseV9uYW1lIjoiQmFyYm9zYSIsImlhdCI6MTY3NTIxMDgyOCwiZXhwIjoxNjc1MjE0NDI4LCJqdGkiOiIzN2Y1ODRhNTk2Y2JmYjgzNWM2NDM3MWU5ZjNhMGQzNjJlZDUxYjQ1In0.G7NdYFN_VFLcLTVoXOL8V_hZBOSMY4Qu5xyoEdwQ9gxg9um46zu9ZVt-LsJZseli8o1cZxrD8nZfLOo6jewG8TeVYN_N94VI-5bXE5a1zn8BZSfHJQJPqYaJLyQWpdOqmtO8PfcKCvY93G3QAtdzSAEw-Tcg_JOl1eIEHi5_WshCCQoMHCOms1jgCHuwSOqsva94INpA0nbMEVnXAZk9ycGdBidJV6F4nfE2ZSoT4Q47M4bQ_qGhj-otiwwkeMrLM338lzURkPRfW9WCmcgcrSKtKzOCH6HSqOe5LT_gKT3t8_x0zsNwrf_66KdaVueOZLOm9kq1fwCV3clF2HnSaA',
    lastName: 'Barbosa',
    name: 'Jose Alisson Barbosa',
    photoUrl: 'https://lh3.googleusercontent.com/a/AEdFTp7M3y9HH7ujYWq-sfNa0g87Q8ExsLF0rxRkYO-l=s96-c',
    provider: 'GOOGLE',
    response: {},
    authToken: '',
    authorizationCode: ''
  };*/

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {

  }

  initLogin() {
    return this.socialAuthService.authState
      .pipe(
        map((socialUser) => {
          this.getUsuarioFromDb(socialUser).subscribe((userDb) => {
            this.setUserFromPs(userDb);

            if (
              socialUser.response != undefined &&
              socialUser.response != null
            ) {
              socialUser.photoUrl = socialUser.response.picture.data.url;
              this.setSocialUser(socialUser);
              console.log(socialUser);
            } else {
              this.setSocialUser(socialUser);
            }
            this.router.navigate(['dashboard']);
          });
        })
      )
  }

  redirect() {
    if (this.setSocialUser != undefined && this.userFromPs != undefined) {
      return false;
    }
    return true;
  }

  salvar() {
    return this.http.post<Usuario>(this.URL_API + '/save', this.userFromPs);
  }

  salvarEAtualizar() {
    return this.http
      .post<Usuario>(this.URL_API + '/save', this.userFromPs)
      .pipe(
        map((data) => {
          this.userFromPs = data;
        })
      );
  }

  getUsuarioFromDb(user: SocialUser) {
    return this.http.post<Usuario>(this.URL_API + '/autoSign', {
      email: user.email,
      provedorr: user.provider,
    });
  }

  setUserFromPs(user: Usuario) {
    this.userFromPs = user;
  }

  setSocialUser(social: SocialUser) {
    this.socialUser = social;
  }
}
