

import { SignInService } from 'src/app/shared/services/sign-in.service';
import { Endereco } from './../../model/endereco.model';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {

  enderecos: Endereco[] = [

  ]

  enderecoAtual!:Endereco

  constructor(private signIn: SignInService) {
    signIn.checkUser()
  }


  ngAfterViewInit(): void {
    let fade = document.getElementById('fade')
    let modal = document.querySelector('#modal')

    document.querySelector('.btn-add')?.addEventListener('click', () => {
      modal?.classList.remove('desatived')
      fade?.classList.remove('desatived')
    })

    document.querySelector('.close')?.addEventListener('click', () => {
      modal?.classList.add('desatived')
      fade?.classList.add('desatived')
    })

    let stepNavgation = document.querySelector('.step-navgation');
    let liList = stepNavgation?.querySelectorAll('li');
    liList?.forEach((li) => {
      li.addEventListener('click', function () {
        liList?.forEach((data) => {
          if (data.classList.contains('active')) {
            data.classList.remove('active');
          }
        });
        li.classList.add('active');
      });
    });

    let obs = document.querySelector('.obs')?.querySelector('textarea')

    obs?.addEventListener("keyup", () => {
      this.max = obs?.value.length + "/" + obs?.maxLength
    })

    let wrappers = document.querySelectorAll('.wrapper')
    wrappers.forEach(w => {


      let selectBtn = w.querySelector('.select-btn')
      selectBtn?.addEventListener('click', () => {
        w.classList.toggle('active')
      })

      w.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          selectBtn?.querySelectorAll('span').forEach(span => {
            w.classList.remove('active')
            span.innerText = li.innerText
          })
        })
      })
    })
  }

  active(element: HTMLDivElement){
      element.classList.toggle('active')
  }

  definirEndereco(addressId:number){
    this.enderecoAtual = this.enderecos.find(({id}) => id === addressId)!
  }

  mudarEndereco(){
    this.enderecoAtual = undefined!
  }

  max = "0/150"

  ngOnInit(): void {
    this.enderecos = this.signIn.userFromPs.enderecos
  }

  moneyPay(){
    return document.getElementById('formPay')?.innerText === "Dinheiro"
  }

  despache(){
    return document.getElementById('formOfDispatch')?.innerText === "Meu endereço"
  }

  isEnderecoDefinido(){
    if(this.enderecoAtual === undefined){
      return false
    }
    return true
  }
}
