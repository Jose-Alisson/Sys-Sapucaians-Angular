import { Usuario } from 'src/app/model/usuario.model';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthPsModel } from './../model/auth-ps.model';
import { SignService } from '../shared/services/sign-service.service';

@Injectable({
  providedIn: 'root',
})
export class PsAdminGuard {

  constructor(private router: Router, private signInService: SignService) {}

  canActivate(): boolean {
    return this.signInService.auth.typeRule === "ADMIN"
  }
}
