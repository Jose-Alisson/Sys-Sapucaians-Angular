import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../sign-in/sign-in.component.scss']
})
export class SignUpComponent implements OnInit, AfterViewInit {

  count = 1

  constructor() { }

  ngAfterViewInit(): void {
    document.querySelector('.btn-prosseguir')?.addEventListener('click', () => {
      this.count = this.count < 4 ? this.count + 1 : this.count;
      this.alternar()
    })
  }

  voltar(){
    this.count -= 1
    this.alternar()
  }

  alternar(){
    ( <HTMLInputElement> document.getElementById('st-' + this.count)).checked = true;
  }

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
