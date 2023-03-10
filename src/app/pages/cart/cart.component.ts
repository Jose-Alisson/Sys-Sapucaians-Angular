import { Usuario } from 'src/app/model/usuario.model';
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

  title = '';

  viewCategory = true;

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
      this.pedido = {
        id: 0,
        numeroDoPedido: 0,
        produtos: [],
        descricao: '',
        tipoDePagamento: 'cartão',
        troco: '',
        endereco: undefined,
      };

      this.openModal();
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

    document.querySelectorAll('.categorys .category').forEach((category) => {
      let categoryWrapper = <HTMLDivElement>(
        category.querySelector('.category-wrapper')
      );
      let produtos = <HTMLDivElement>categoryWrapper.querySelector('.produtos');
      let tamanho = produtos?.offsetHeight;

      categoryWrapper.style.setProperty('height', 0 + 'px');

      const observerCategory = new MutationObserver(function (mutationsList) {
        for (let mutation of mutationsList) {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class'
          ) {
            tamanho = produtos.offsetHeight;
            if (category.classList.contains('active')) {
              categoryWrapper.style.setProperty('height', tamanho + 'px');
            } else {
              categoryWrapper.style.setProperty('height', 0 + 'px');
            }
          }
        }
      });
      observerCategory.observe(category, { attributes: true });
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

    this.pedidoService.findByUsuarioId().subscribe((data) => {
      this.pedidos = data;
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
    let produtos: Produto[] = this.todosProdutos.filter(
      (product) => product.categoria === categoria
    );

    produtos.sort((a, b) => a.nomeDoProduto.localeCompare(b.nomeDoProduto));
    return produtos;
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

  categoryActive(element: HTMLDivElement) {
    element.classList.toggle('active');
  }

  adicionarProduto(qp: QuantidadeProduto) {
    this.pedido.produtos.push(qp);
    console.log(qp)
  }

  criarPedido() {
    this.pedido.usuario = this.signIn.userFromPs;
    console.log(this.pedido);

    this.pedidoService.selvar(this.pedido).subscribe((data) => {
      if (this.pedidos.find((pedido) => pedido.id === data.id)) {
        this.pedidos = this.pedidos.filter((pedid) => pedid.id !== data.id);
        this.pedidos.push(data);
      }

      let fade = document.getElementById('fade');
      let modal = document.querySelector('#modal');

      modal?.classList.add('desatived');
      fade?.classList.add('desatived');
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
      return this.enderecos?.length * 200 + 120;
    }
  }

  getSubTotal() {
    let valor = 0;
    this.pedido.produtos.forEach((p) => {
      if(p){
      valor += p.quantidade * p.produto!.preco;
      }
    });
    return valor;
  }

  getTotal() {
    let valor = this.getSubTotal();
    if (this.enderecoAtual != undefined) {
      valor += this.getTaxa();
    }
    return valor;
  }

  getTaxa(): number {
    let regex;
    return exValoresDaTaxa.find((taxa) => {
      regex = new RegExp(`\\b${taxa.localidade}\\b`, 'i');
      return regex.test(this.enderecoAtual.localidade);
    })?.preco!;
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

  editPedido(idPedido: number) {
    this.pedido = this.pedidos.find(({ id }) => id === idPedido)!;
    this.openModal();
  }

  removerPedido() {
    this.pedidoService.delete(this.pedido.id).subscribe((data) => {
      this.pedidos = this.pedidos.filter((ped) => ped.id !== this.pedido.id);
      this.closeModal();
    });
  }

  removerProduto(id: number) {
    const index = this.pedido.produtos.findIndex((item) => item.produto!.id === id);
    if (index >= 0) {
      this.pedido.produtos.splice(index, 1);
    }
  }

  openModal() {
    let fade = document.getElementById('fade');
    let modal = document.querySelector('#modal');

    modal?.classList.remove('desatived');
    fade?.classList.remove('desatived');

    document.querySelectorAll('.step-navgation ul .list').forEach((li, i) => {
      if (i === 0) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });

    (<HTMLInputElement>document.getElementById('st-1')).checked = true;
  }

  fadeToggle(element: HTMLElement) {
    element.classList.toggle('active');
  }

  closeModal() {
    let fade = document.getElementById('fade');
    let modal = document.querySelector('#modal');

    modal?.classList.add('desatived');
    fade?.classList.add('desatived');
  }
}
