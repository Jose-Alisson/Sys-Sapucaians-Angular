import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  active(){
    document.getElementById('fade')?.classList.remove('desatived')
    document.getElementById('modal')?.classList.remove('desatived')
  }

  desative(){
    document.getElementById('fade')?.classList.add('desatived')
    document.getElementById('modal')?.classList.add('desatived')
  }
}
