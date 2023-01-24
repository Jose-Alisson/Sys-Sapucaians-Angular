import { Usuario } from './../../../model/usuario.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  usuario: Usuario = {
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
       {
        id: 1,
        nomeDoEndereco: 'Casa da minha vó',
        cep: '54636434',
        numeroDaCasa: '84',
        localidade: 'ur2',
      },
      {
        id: 2,
        nomeDoEndereco: 'Igreja',
        cep: '51348087',
        numeroDaCasa: '56',
        localidade: 'ur12',
      },
    ],
  }

  constructor() {}

  setUsuario(usuario: Usuario) {
    this.usuario = usuario;
  }
}
