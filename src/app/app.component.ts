import { Usuario } from 'src/app/model/usuario.model';
import { SignService } from './shared/services/sign-service.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthPsModel } from './model/auth-ps.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Sys-Sapucaians-Angular';

  constructor(private route: Router, private signService: SignService) {}

  ngOnInit(): void {
    const auth = getAuth();

    if (localStorage.getItem('Token-Access')) {
      this.signService
        .login({
          tokenAccess: JSON.parse(localStorage.getItem('Token-Access') ?? ''),
        })
        .subscribe({
          next: (res) => {
            /*let rule = res?.['auth']?.['typeRule']
            this.route.navigate([rule + "" === "ADMIN" ? "dashboard-admin" : "dashboard"])*/
          },
          error: () => {
            this.route.navigate(['account']);
          },
        });
        return;
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.signService
          .login({ email: user.email, password: user.uid })
          .subscribe({
            next: (res) => {
              let rule = res?.['auth']?.['typeRule']
              this.route.navigate(['dash-board'])
            },
            error: (err: HttpErrorResponse) => {
              this.route.navigate(['account']);
            },
          });
      } else {
        this.route.navigate(['account']);
      }
    });
  }
}
