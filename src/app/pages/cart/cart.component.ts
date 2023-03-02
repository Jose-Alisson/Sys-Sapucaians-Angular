import { PedidoService } from './../../shared/services/pedido/pedido.service';
import { QuantidadeProduto } from './../../model/quantidade.model';
import { Pedido } from './../../model/pedido.model';
import { ProdutoService } from './../../shared/services/produto/produto.service';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Produto } from 'src/app/model/Produto.model';
import { SignInService } from 'src/app/shared/services/signIn/sign-in.service';
import { Endereco } from './../../model/endereco.model';

import * as $ from 'jquery';
import { ImagemService } from 'src/app/shared/services/imagem/imagem.service';
import { DomSanitizer } from '@angular/platform-browser';
import { exValoresDaTaxa } from '../about/about.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {
  pedido: Pedido = {
    id: 0,
    numeroDoPedido: 0,
    produtos: [],
    descricao: '',
    tipoDePagamento: 'cartão',
    troco: '',
    endereco: undefined,
  };

  pedidos: Pedido[] = [];

  todosProdutos: Produto[] = [];
  produtos: Produto[] = [];

  enderecos: Endereco[] = [];
  enderecoAtual!: Endereco;

  selectedProduto?: Produto;

  title = '';

  viewCategory = true;

  quanatidadeProduto: QuantidadeProduto = {
    id: 0,
    produto: this.selectedProduto,
    quantidade: 1,
  };

  constructor(
    private signIn: SignInService,
    private produtoService: ProdutoService,
    private imagemService: ImagemService,
    private sanitizer: DomSanitizer,
    private pedidoService: PedidoService
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
    wrappers.forEach((w, i) => {
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

    let stepNavegation = document.querySelectorAll('.step-navgation ul li');
    stepNavegation.forEach((li) => {
      li.addEventListener('click', () => {
        let text = (<HTMLSpanElement>li.querySelector('label .text'))
          ?.innerText;
        let primeiraLetra = text.charAt(0).toUpperCase();
        let restoDaString = text.slice(1).toLowerCase();
        let minhaNovaString = primeiraLetra + restoDaString;
        this.title = minhaNovaString;
      });
    });
  }

  active(element: HTMLDivElement) {
    element.classList.toggle('active');
  }

  definirEndereco(addressId: number) {
    this.enderecoAtual = this.enderecos.find(({ id }) => id === addressId)!;
    this.pedido.endereco = this.enderecoAtual;
  }

  mudarEndereco() {
    this.enderecoAtual = undefined!;
    this.pedido.endereco = undefined!;
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
      this.produtos = this.todosProdutos;
      this.setRandomProduct();
    });
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
    this.produtos = this.todosProdutos.filter(
      (product) => product.categoria === categoria
    );
    return this.produtos;
  }

  seachProduct(seach: HTMLInputElement) {
    if (seach.value === '') {
      this.viewCategory = true;
      this.produtos = this.todosProdutos;
    } else {
      this.viewCategory = false;
      this.produtos = this.todosProdutos.filter((product) =>
        product.nomeDoProduto.toLowerCase().includes(seach.value.toLowerCase())
      );
    }
  }

  setProductView(index: number) {
    document.querySelector('.modal-p')?.classList.remove('desatived');
    this.selectedProduto = this.produtos[index];
  }

  productClose() {
    document.querySelector('.modal-p')?.classList.add('desatived');
  }

  categoryActive(element: HTMLDivElement) {
    element.classList.toggle('active');
  }

  almentarQuantidade() {
    if (this.quanatidadeProduto.quantidade < 10) {
      this.quanatidadeProduto.quantidade += 1;
    }
  }

  diminuirQuantidade() {
    if (this.quanatidadeProduto.quantidade > 1) {
      this.quanatidadeProduto.quantidade -= 1;
    }
  }

  almentarQuantidadeProdPedido(index: number) {
    if (this.pedido.produtos[index].quantidade < 10) {
      this.pedido.produtos[index].quantidade += 1;
    }
  }

  diminuirQuantidadeProdPedido(index: number) {
    if (this.pedido.produtos[index].quantidade > 1) {
      this.pedido.produtos[index].quantidade -= 1;
    } else {
      this.pedido.produtos.splice(index, 1);
    }
  }

  adicionarProduto() {
    let qp: QuantidadeProduto = {
      id: 0,
      produto: this.selectedProduto,
      quantidade: this.quanatidadeProduto.quantidade,
    };

    this.pedido.produtos.push(qp);

    this.quanatidadeProduto = {
      id: 0,
      produto: this.selectedProduto,
      quantidade: 1,
    };
  }

  criarPedido() {
    console.log(this.pedido);

    this.pedidoService
      .selvar(this.pedido)

      .subscribe((data) => {
        this.pedidos.push(data);
      });
  }

  setEntLocal() {
    this.enderecoAtual = undefined!;
  }

  definirTipoDePagameto(tipoPagamento: string) {
    this.pedido.tipoDePagamento = tipoPagamento;
  }

  getAddressWidth() {
    if (this.enderecos === undefined) {
      return 0;
    } else {
      return this.enderecos?.length * 200;
    }
  }

  getSubTotal() {
    let valor = 0;

    this.pedido.produtos.forEach((p) => {
      valor += p.quantidade * p.produto!.preco;
    });

    return valor;
  }

  getTotal() {
    let valor = this.getSubTotal();

    if (this.enderecoAtual != undefined) {
      //console.log(this.enderecoAtual);

      let regex;

      valor += exValoresDaTaxa.find((taxa) => {
        regex = new RegExp(`\\b${taxa.localidade}\\b`,'i')
        return regex.test(this.enderecoAtual.localidade);
      })?.preco!;
    }
    return valor;
  }

  setImageStyle(img: HTMLImageElement) {
    /*console.log(img.height +'/'+ img.width)
    if(img.height > img.width){
      img.style.maxHeight = "240px !important"
      img.style.width = "auto"
    }*/
  }

  getImageStyle(img: HTMLImageElement) {
    if (img.height >= img.width) {
      return 'max-height: 240px !important; width: auto !important;';
    }
    return "content:'' ";
  }

  setCategory(category: string) {
    this.produtos = this.todosProdutos.filter(
      (produto) => produto.categoria === category
    );
  }

  setMaxValue(obs: HTMLTextAreaElement) {
    this.max = obs?.value.length + '/' + obs?.maxLength;
  }

  randomNameproduct = 'Pizza';

  setRandomProduct() {
    if (this.todosProdutos.length === 0) {
      this.randomNameproduct = 'Pizza';
    }
    this.randomNameproduct =
      this.todosProdutos[
        Math.floor(Math.random() * this.todosProdutos.length - 1)
      ].nomeDoProduto!;
  }
}
