import { AccountService } from './../../shared/services/account/account-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  myAccount = ""

  constructor(private account : AccountService) {
    this.myAccount = JSON.stringify(account.usuario)
  }

  ngOnInit(): void {
  }

}
