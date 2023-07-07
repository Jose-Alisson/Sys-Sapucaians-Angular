import { SignService } from './../shared/services/sign-service.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanMatchFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthPsModel } from '../model/auth-ps.model';

@Injectable({
  providedIn: 'root',
})
export class LoadAdmGuard {
  constructor(private sign: SignService, private router: Router) {}

   canActivate(): boolean {
    return true ; (this.sign.auth.typeRule ?? '') === "ADMIN";
  }


  async getIsLogged(){
    let isAuthorized = false
    this.sign.login({
      tokenAccess: JSON.parse(localStorage.getItem('Token-Access') ?? ''),
    })
    .subscribe({ next: (auth) => {
      if(auth?.['auth']?.['typeRule'] === 'ADMIN'){
        isAuthorized = true
      }
      console.log(isAuthorized)
    }});
    console.log(isAuthorized + 'oir')
    return isAuthorized
  }
}
