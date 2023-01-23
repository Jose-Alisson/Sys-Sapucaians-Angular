import { Usuario } from './../../model/usuario.model';
import { AccountService } from './../../shared/services/account/account-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  myAccount!: Usuario

  constructor(private account : AccountService) {
    this.myAccount = account.usuario
  }

  ngOnInit(): void {
  }

}
