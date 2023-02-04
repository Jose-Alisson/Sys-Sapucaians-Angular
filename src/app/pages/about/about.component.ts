import { filter } from 'rxjs';
import { Endereco } from './../../model/endereco.model';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { SignInService } from 'src/app/shared/services/signIn/sign-in.service';
import { Usuario } from './../../model/usuario.model';
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, AfterViewInit {
  endereco: Endereco = new Endereco();
  numeroDeTelefone = '';
  addressCount = 0;

  constructor(
    private router: Router,
    private signIn: SignInService,
    private authService: SocialAuthService,
    private cdr: ChangeDetectorRef
  ) {
    if (this.signIn.redirect()) {
      router.navigate(['account']);
      return;
    }
  }
  ngAfterViewInit(): void {
    let fade = document.getElementById('fade');
    let modal = document.querySelector('#modal-add-addrss');
    let modalEdit = document.getElementById('modal-edit-addrss');
    let modalPhone = document.getElementById('modal-adit-phone');

    document.querySelector('.close')?.addEventListener('click', () => {
      modal?.classList.add('desatived');
      fade?.classList.add('desatived');
    });

    modalPhone?.querySelector('.close')?.addEventListener('click', () => {
      modalPhone?.classList.add('desatived');
      fade?.classList.add('desatived');
    });

    modalEdit?.querySelector('.close')?.addEventListener('click', () => {
      modalEdit?.classList.add('desatived');
      fade?.classList.add('desatived');
    });

    let btnAdd = document.getElementById('btn-add');
    btnAdd?.addEventListener('click', () => {
      modal?.classList.remove('desatived');
      fade?.classList.remove('desatived');
    });

    modalPhone?.querySelector('#btn-add')?.addEventListener('click', () => {
      modalPhone?.classList.add('desatived');
      fade?.classList.add('desatived');
    });
  }

  ngOnInit(): void {}

  sair() {
    this.authService.signOut();
    this.router.navigate(['account']);
  }

  adicionarEndereco() {
    this.signIn.userFromPs.enderecos.push(this.endereco);
    this.signIn.salvarEAtualizar().subscribe();

    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal-add-addrss')?.classList.add('desatived');
  }

  limpar() {
    this.endereco = {
      id: 0,
      nomeDoEndereco: '',
      cep: '',
      numeroDaCasa: '',
      localidade: '',
    };
  }

  getUserFromPs() {
    return this.signIn.userFromPs;
  }

  getSocialUser() {
    return this.signIn.socialUser;
  }

  editarEndereco(id: number) {
    this.addressCount = id;
    this.endereco = this.getUserFromPs().enderecos[this.addressCount]

    document.getElementById('fade')?.classList.remove('desatived');
    document.getElementById('modal-edit-addrss')?.classList.remove('desatived');
  }

  salvarEndereco() {
    this.getUserFromPs().enderecos[this.addressCount] = this.endereco
    this.signIn.salvarEAtualizar().subscribe()

    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal-edit-addrss')?.classList.add('desatived');
  }

  removeEndereco() {
    this.getUserFromPs().enderecos.splice(this.addressCount, 1);
    this.signIn.salvarEAtualizar().subscribe();

    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal-edit-addrss')?.classList.add('desatived');
  }

  salvarNumero() {
    this.getUserFromPs().contato = this.numeroDeTelefone
    this.signIn.salvarEAtualizar().subscribe()

    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal-adit-phone')?.classList.add('desatived');
  }
}
