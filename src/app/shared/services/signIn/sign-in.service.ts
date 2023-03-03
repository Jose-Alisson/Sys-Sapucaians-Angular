import { UrlApiService } from './../UrlApi/url-api.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import {
  SocialUser,
  SocialAuthService,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { Injectable, Injector } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {  map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignInService {

  private URL_API = this.urlApi.URl_API + '/user';

  userFromPs!: Usuario ;
  socialUser!: SocialUser;

  constructor(
    private urlApi:UrlApiService,
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

  buscar(){
    this.http.post<Usuario>(this.URL_API + '/find/ngrok', {}).subscribe(data => {
      this.userFromPs = data
      console.log('Ola')
    })
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
