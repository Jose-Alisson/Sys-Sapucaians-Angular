import { SignInService } from './../signIn/sign-in.service';
import { Router } from '@angular/router';
import { Usuario } from './../../../model/usuario.model';
import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  usuarios:Usuario[] = [
    {
      id: 0,
      foto: '',
      nome: 'Jose Alisson',
      email: 'Alisson@gmail.com',
      senha: '123456',
      contato: '973127515',
      pedidos: [],
      enderecos: [
        {
          id: 0,
          nomeDoEndereco: 'Minha Casa',
          cep: '51345080',
          numeroDaCasa: '90',
          localidade: 'ur3',
        },
      ],
    }
  ]

  constructor(private router:Router, private injector:Injector) { }

  create(usuario:Usuario){
    this.usuarios.push(usuario)
    this.injector.get<SignInService>(SignInService).login(usuario.email,usuario.senha)
  }
}
