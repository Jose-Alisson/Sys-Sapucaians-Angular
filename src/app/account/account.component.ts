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
  ) {
    this.authService.authState.subscribe((socialUser) => {
      this.signInService.getUsuarioFromDb(socialUser).subscribe((userDb) => {
        this.signInService.setUserFromPs(userDb);

        if (socialUser.response != undefined && socialUser.response != null) {
          socialUser.photoUrl = socialUser.response.picture.data.url
          this.signInService.setSocialUser(socialUser);
          console.log(socialUser)
        } else {
          this.signInService.setSocialUser(socialUser);
        }

        //console.log(socialUser)
        //console.log(userDb)

        this.router.navigate(['dashboard']);
      });
    });
  }

  redirect() {}

  loginWithGoogle() {
    document
      .querySelector('asl-google-signin-button')
      ?.querySelector('div')
      ?.lastElementChild?.querySelector('div')
      ?.click();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

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
