import { Auth, getAuth, signOut } from 'firebase/auth';
import { filter } from 'rxjs';

import { Router } from '@angular/router';
import { Usuario } from './../../model/usuario.model';
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Endereco } from 'src/app/model/endereco.model';
import { SignService } from 'src/app/shared/services/sign-service.service';
import { AuthPsModel } from 'src/app/model/auth-ps.model';

export const exValoresDaTaxa = [
  { localidade: 'Ur1', preco: 4 },
  { localidade: 'Ur2', preco: 3 },
  { localidade: 'Ur3', preco: 3 },
  { localidade: 'Ur12', preco: 3 },
  { localidade: 'Ur5', preco: 5 },
  { localidade: 'Monte Verde', preco: 4 },
  { localidade: 'Lagoa Encantada', preco: 4 },
  { localidade: 'Zumbi do Pacheco', preco: 4 },
  { localidade: 'Minha localidade não se encontra aqui'}
];

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],

})
export class AboutComponent implements OnInit, AfterViewInit {
  auth: AuthPsModel
  user?: Usuario

  endereco: Endereco = {
    id: 0,
    nameAddress: '',
    zipCode: '',
    houseNumber: '',
    locality: '',
  };
  numeroDeTelefone = '';
  addressCount = 0;

  valoresDaTaxa = exValoresDaTaxa;
  addressModalActive = false

  constructor(private router: Router, private signService: SignService) {
    this.auth = signService.auth!
    this.user = this.auth.user
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.auth = this.signService.auth!
    this.user = this.auth.user
    console.log(this.user?.contact)
  }

  sair() {
    const auth = getAuth();
    signOut(auth).then(() => {
        localStorage.removeItem('Token-Access')
        this.signService.auth = { user : undefined }
        this.router.navigate(['account']);
      })
      .catch((err) => {
        console.log(err.message)
      });
  }

  adicionarEndereco() {
    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal-add-addrss')?.classList.add('desatived');
  }

  limpar() {
    this.endereco = {
      id: 0,
      nameAddress: '',
      zipCode: '',
      houseNumber: '',
      locality: '',
    };
  }

  editarEndereco(id: number) {
    this.addressCount = id;

    document.getElementById('fade')?.classList.remove('desatived');
    document.getElementById('modal-edit-addrss')?.classList.remove('desatived');
  }

  salvarEndereco() {
    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal-edit-addrss')?.classList.add('desatived');
  }

  removeEndereco() {
    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal-edit-addrss')?.classList.add('desatived');
  }

  salvarNumero() {
    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal-adit-phone')?.classList.add('desatived');
  }
}
