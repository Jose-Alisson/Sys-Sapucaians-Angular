import { Usuario } from './../../../model/usuario.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {

  usuario!: Usuario;

  constructor() { }

  getUsuario(){
    return this.usuario
  }

  setUsuario(usuario:Usuario){
    this.usuario = usuario;
  }
}
