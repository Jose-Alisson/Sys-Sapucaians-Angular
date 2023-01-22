import { Usuario } from './../../../model/usuario.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  usuario!: Usuario

  constructor() { }

  setUsuario(usuario:Usuario){
    this.usuario = usuario;
  }
}
