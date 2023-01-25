import { Usuario } from 'src/app/model/usuario.model';
import { SocialUser, SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable, Injector } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  userFromPs!: Usuario

  socialUser!: SocialUser

  constructor(private http: HttpClient, private authService: SocialAuthService) {

  }

  setUser(authService: SocialAuthService){
    return authService.authState.pipe(map(d => {
      this.socialUser = d
    }))
  }
}
