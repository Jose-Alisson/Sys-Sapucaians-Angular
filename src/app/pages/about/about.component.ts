import { SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { SignInService } from 'src/app/shared/services/sign-in.service';
import { Usuario } from './../../model/usuario.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, AfterViewInit {

  userFromPs!: Usuario;

  socialUser!: SocialUser;

  constructor(private router: Router, private signIn: SignInService) {

    if (signIn.checkUser()) {
      this.socialUser = signIn.socialUser;
      this.userFromPs = signIn.userFromPs;
    }
  }
  ngAfterViewInit(): void {
    let fade = document.getElementById('fade')
    let modal = document.querySelector('#modal-add-addrss')

    document.querySelector('.close')?.addEventListener('click', () => {
      modal?.classList.add('desatived')
      fade?.classList.add('desatived')
    })

    let btnAdd = document.getElementById('btn-add')
    btnAdd?.addEventListener('click', ()  => {
      modal?.classList.remove('desatived')
      fade?.classList.remove('desatived')
    })
  }

  ngOnInit(): void {}

  sair(){
    this.signIn.sair()
    this.router.navigate(['account'])
  }
}
