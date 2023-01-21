import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../sign-in/sign-in.component.scss']
})
export class SignUpComponent implements OnInit {

  count = 2

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
