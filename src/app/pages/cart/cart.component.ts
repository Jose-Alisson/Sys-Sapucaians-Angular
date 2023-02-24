import { Pedido } from './../../model/pedido.model';
import { ProdutoService } from './../../shared/services/produto/produto.service';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Produto } from 'src/app/model/Produto.model';
import { SignInService } from 'src/app/shared/services/signIn/sign-in.service';
import { Endereco } from './../../model/endereco.model';

import * as $ from 'jquery';
import { ImagemService } from 'src/app/shared/services/imagem/imagem.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {
  @ViewChild('seach')
  seach!: HTMLInputElement;

  todosProdutos: Produto[] = [];
  produtos: Produto[] = [];

  pediddo: Pedido = new Pedido();
  enderecos: Endereco[] = [];
  enderecoAtual!: Endereco;
  allView = '';

  selectedProduto?: Produto;

  constructor(
    private signIn: SignInService,
    private produtoService: ProdutoService,
    private imagemService: ImagemService,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    let fade = document.getElementById('fade');
    let modal = document.querySelector('#modal');

    document.querySelector('.btn-add')?.addEventListener('click', () => {
      modal?.classList.remove('desatived');
      fade?.classList.remove('desatived');
    });

    document.querySelector('.close')?.addEventListener('click', () => {
      modal?.classList.add('desatived');
      fade?.classList.add('desatived');
    });

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

    let obs = document.querySelector('.obs')?.querySelector('textarea');

    obs?.addEventListener('keyup', () => {
      this.max = obs?.value.length + '/' + obs?.maxLength;
    });

    let wrappers = document.querySelectorAll('.wrapper');
    wrappers.forEach((w) => {
      let selectBtn = w.querySelector('.select-btn');
      selectBtn?.addEventListener('click', () => {
        w.classList.toggle('active');
      });

      w.querySelectorAll('li').forEach((li) => {
        li.addEventListener('click', () => {
          selectBtn?.querySelectorAll('span').forEach((span) => {
            w.classList.remove('active');
            span.innerText = li.innerText;
          });
        });
      });
    });

    this.enderecos = this.signIn.userFromPs?.enderecos;
    console.log(this.todosProdutos);
  }

  active(element: HTMLDivElement) {
    element.classList.toggle('active');
  }

  definirEndereco(addressId: number) {
    this.enderecoAtual = this.enderecos.find(({ id }) => id === addressId)!;
  }

  mudarEndereco() {
    this.enderecoAtual = undefined!;
  }

  max = '0/150';

  ngOnInit(): void {
    this.produtoService.getProductAll().subscribe((data) => {
      let produtos: Produto[] = data;
      produtos.forEach((prod) => {
        this.imagemService.downloadImagem(prod.id).subscribe((blob: Blob) => {
          const url = URL.createObjectURL(blob);
          prod.urlImagem = this.sanitizer.bypassSecurityTrustUrl(url);
        });
      });
      this.todosProdutos = produtos;
    });

    this.produtos = this.todosProdutos;
    this.selectedProduto = this.todosProdutos[0];
    console.log(this.todosProdutos);
  }

  moneyPay() {
    return document.getElementById('formPay')?.innerText === 'Dinheiro';
  }

  despache() {
    return (
      document.getElementById('formOfDispatch')?.innerText === 'Meu endereço'
    );
  }

  isEnderecoDefinido() {
    if (this.enderecoAtual === undefined) {
      return false;
    }
    return true;
  }

  getCategory(categoria: string): Produto[] {
    return this.todosProdutos.filter(
      (product) => product.categoria === categoria
    );
  }

  seachProduct(seach: HTMLInputElement) {
    if (seach.value === '') {
      this.allView = '';
      this.produtos = this.todosProdutos;
    } else {
      this.allView = ' ';
      this.produtos = this.todosProdutos.filter((product) =>
        product.nomeDoProduto.toLowerCase().includes(seach.value.toLowerCase())
      );
    }
  }

  setProductView(index: number) {
    document.querySelector('.modal-p')?.classList.remove('desatived')

    if (this.allView === '') {
      this.selectedProduto = this.todosProdutos[index];
    } else {
      this.selectedProduto = this.produtos[index];
    }
  }

  productClose(){
    document.querySelector('.modal-p')?.classList.add('desatived')
  }

  categoryActive(element: HTMLDivElement) {
    element.classList.toggle('active');
  }
}
