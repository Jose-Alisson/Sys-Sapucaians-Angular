import { SignUpService } from './../../shared/services/signUp/sign-up.service';
import { AccountService } from './../../shared/services/account/account-service.service';
import { Endereco } from './../../model/endereco.model';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Usuario } from 'src/app/model/usuario.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../sign-in/sign-in.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  forms: FormGroup[] = [new FormGroup({}), new FormGroup({})];

  errorVisible: boolean[] = [false, true];

  count = 1;

  endereco: Endereco = {
    id: 0,
    nomeDoEndereco: '',
    cep: '',
    numeroDaCasa: '',
    localidade: '',
  };

  usuario: Usuario = {
    id: 0,
    foto: '',
    nome: '',
    email: '',
    senha: '',
    contato: '',
    pedidos: [],
    enderecos: [],
  };

  constructor(
    private formBuild: FormBuilder,
    private signUpService: SignUpService
  ) {}

  ngAfterViewInit(): void {
    document.querySelector('.btn-prosseguir')?.addEventListener('click', () => {
      if (this.forms[this.count - 1] !== undefined) {
        if (this.forms[this.count - 1].valid) {
          this.alternar(1);
        }
        this.errorVisible[this.count - 1] = true;
      } else {
        this.exibir = false;
        this.alternar(1);
      }

      if (this.count >= 5) {
        if (
          this.endereco.nomeDoEndereco != '' ||
          this.endereco.cep != '' ||
          this.endereco.nomeDoEndereco != '' ||
          this.endereco.localidade != ''
        ) {
          this.usuario.enderecos.push(this.endereco)
        }
        this.create();
      }
    });
  }

  voltar() {
    this.alternar(-1);
  }

  alternar(value: number) {
    this.count += value;
    try {
      (<HTMLInputElement>document.getElementById('st-' + this.count)).checked =
        true;
    } catch (error) {}
  }

  ngOnInit(): void {
    this.forms[0] = this.formBuild.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required]],
    });

    this.forms[1] = this.formBuild.group({
      nome: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  visibilidade(element: HTMLElement) {
    let password = <HTMLInputElement>document.getElementById('password');
    password.type = password.type == 'password' ? 'text' : 'password';
    if (element.classList.contains('fa-eye')) {
      element.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      element.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }

  getEmailElement(): FormControl {
    return this.forms[0].get('email') as FormControl;
  }

  getPasswordElement(): FormControl {
    return this.forms[0].get('password') as FormControl;
  }

  getConfirmPasswordElement(): FormControl {
    return this.forms[0].get('confirmPassword') as FormControl;
  }

  isEqual() {
    return (
      this.getConfirmPasswordElement().value === this.getPasswordElement().value
    );
  }

  exibir = false;

  isExibirAll() {
    return this.errorVisible[this.count - 1];
  }

  getNomeElement(): FormControl {
    return this.forms[1].get('nome') as FormControl;
  }

  create() {
    this.signUpService.create(this.usuario);
  }

  isValid(){
    if (this.forms[this.count - 1] !== undefined) {
      return (this.forms[this.count - 1].invalid && this.isExibirAll())
    }
    return false;
  }
}
