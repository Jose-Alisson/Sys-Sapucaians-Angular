import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  visibilidade(element: HTMLElement){
    let password = ( <HTMLInputElement> document.getElementById('password'))
    password.type = password.type == "password" ? "text" : "password"
    if(element.classList.contains("fa-eye")){
      element.classList.replace('fa-eye', 'fa-eye-slash')
    } else {
      element.classList.replace('fa-eye-slash', 'fa-eye')
    }
  }
}
