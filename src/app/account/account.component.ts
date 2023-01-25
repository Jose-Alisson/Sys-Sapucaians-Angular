import { Router } from '@angular/router';
import { SignInService } from './../shared/services/sign-in.service';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private authService: SocialAuthService,
    private signInService: SignInService
  ) {}

  loginWithGoogle() {
    document
      .querySelector('asl-google-signin-button')
      ?.querySelector('div')
      ?.lastElementChild?.querySelector('div')
      ?.click();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.signInService.authUser().subscribe(d => {
      history.back()
    })
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  sair() {
    this.authService.signOut();
  }

  cascadClick(element: HTMLElement) {
    element.childNodes;
  }
}
