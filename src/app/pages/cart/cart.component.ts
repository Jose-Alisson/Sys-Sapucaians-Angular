import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
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

    let textArea = (<HTMLTextAreaElement> document.getElementById('textArea'))
    textArea?.addEventListener('keyup', () => {
      this.max = "" + textArea?.value.length + "/" + textArea.maxLength
    })
  }

  max = "0/150"

  ngOnInit(): void {}

  active() {
    document.getElementById('fade')?.classList.remove('desatived');
    document.getElementById('modal')?.classList.remove('desatived');
  }

  desative() {
    document.getElementById('fade')?.classList.add('desatived');
    document.getElementById('modal')?.classList.add('desatived');
  }

  formaDePagamento(forma:string){
    return document.getElementById('pagamento')?.innerText == forma
  }
}
