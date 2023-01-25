import { SignInService } from './../shared/services/signIn/sign-in.service';
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

  constructor(private authService: SocialAuthService, private signInService: SignInService) {}

  loginWithGoogle() {
    document.querySelector('asl-google-signin-button') ?.querySelector('div')?.lastElementChild?.querySelector('div')?.click();
    alert(document.querySelector('asl-google-signin-button') ?.querySelector('div')?.lastElementChild?.querySelector('div'))
   console.log(document.querySelector('asl-google-signin-button'))
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      alert(user.email)
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  sair() {
    this.authService.signOut();
  }
}
