import { SignUpComponent, showViewDarken } from './../pages/sign-up/sign-up.component';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import { SignService } from './../shared/services/sign-service.service';

import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import { AuthPsModel } from '../model/auth-ps.model';
import { BehaviorSubject, async, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, AfterViewInit {

  entrar: boolean = true

  constructor(private router: Router, private signService: SignService, private show: showViewDarken) {
    if(localStorage.getItem('Token-Access')){
      //localStorage.removeItem('Token-Access')
    }
  }

  loginGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithPopup(auth, provider)
          .then((result) => {
            this.login(result)
          })
          .catch((error) => {
            console.log('Erro ao fazer login:', error);
          });
      })
      .catch((error) => {
        console.log('Erro ao definir a persistência da sessão:', error);
      });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  signInWithFB(): void {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithPopup(auth, provider)
          .then((result) => {
            this.login(result);
          })
          .catch((error) => console.log('Erro ao fazer login:', error));
      })
      .catch((error) => console.log('Erro ao definir a persistência da sessão:', error));
  }

  login(result: UserCredential){
    this.signService
    .login({email: result.user.email,password: result.user.uid})
    .subscribe({
      next: (data_) => {
        this.router.navigate(['dash-board']);
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 404){
          this.signService.salvar(this.getAuthPsFormat(result)).subscribe({
            next: (data) => {
              this.signService.login({email: result.user.email, password: result.user.uid})
              .subscribe({
                next: (data_) => {
                  this.router.navigate(['dash-board']);
                },
                error: () => {
                  alert("Algo Deu Erro")
                }
              })
            }
          })
        }
      }
    });
  }

  private getAuthPsFormat(result: UserCredential) {
    let authPs: AuthPsModel = {
      id: 0,
      user: {
        id: 0,
        photoUrl: result.user.photoURL ?? '',
        contact: '',
        name: result.user.displayName ?? '',
        addresses: [],
        orders: [],
      },
      email: result.user.email ?? '',
      password: result.user.uid,
      permissoes: [],
    };
    return authPs;
  }

  getViewDarken(){
    return this.show.show
  }
}
