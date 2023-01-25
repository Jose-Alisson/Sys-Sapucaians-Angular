import { SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { SignInService } from 'src/app/shared/services/sign-in.service';
import { Usuario } from './../../model/usuario.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  userFromPs!: Usuario;

  socialUser!: SocialUser;

  constructor(private router: Router, private signIn: SignInService) {

    if (signIn.checkUser()) {
      this.socialUser = signIn.socialUser;
      this.userFromPs = signIn.userFromPs;
    }
  }

  ngOnInit(): void {}

  sair(){
    this.signIn.sair()
    this.router.navigate(['account'])
  }
}
