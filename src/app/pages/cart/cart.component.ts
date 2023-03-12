
import { PedidoService } from './../../shared/services/pedido/pedido.service';
import { Pedido } from './../../model/pedido.model';
import { ProdutoService } from './../../shared/services/produto/produto.service';

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Produto } from 'src/app/model/Produto.model';
import { SignInService } from 'src/app/shared/services/signIn/sign-in.service';
import { ImagemService } from 'src/app/shared/services/imagem/imagem.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {

  @ViewChild('modal', {static: true})
  modal?: ElementRef

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

  viewModal = false

  constructor(
    private signIn: SignInService,
    private produtoService: ProdutoService,
    private imagemService: ImagemService,
    private sanitizer: DomSanitizer,
    private pedidoService: PedidoService
  ) {}

  ngAfterViewInit(): void {

    document.querySelector('.btn-add')?.addEventListener('click', () => {
      this.openModal();
    });

    document.querySelector('.close')?.addEventListener('click', () => {
      this.closeModal()
    });
  }

  active(element: HTMLDivElement) {
    element.classList.toggle('active');
  }

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

    this.pedidoService.findByUsuarioId().subscribe((data) => {
      this.pedidos = data;
    });
  }

  categoryActive(element: HTMLDivElement) {
    element.classList.toggle('active');
  }


  criarPedido() {
    this.pedido.usuario = this.signIn.userFromPs;
    console.log(this.pedido);

    this.pedidoService.selvar(this.pedido).subscribe((data) => {
      const index = this.pedidos.findIndex((item) => item.id === data?.id);
      if (index !== -1) {
        this.pedidos.splice(index, 1, data);
      } else {
        this.pedidos.push(data)
      }

      this.viewModal = false
    });
  }


  editPedido(idPedido: number) {
    this.pedido = this.pedidos.find(({ id }) => id === idPedido)!;

    this.pedido.produtos.forEach((prod) => {
      let product = prod.produto;

      if (product && product?.id) {
        this.imagemService
          .downloadImagem(product.id)
          .subscribe((blob: Blob) => {
            const url = URL.createObjectURL(blob);
            product!.urlImagem = this.sanitizer.bypassSecurityTrustUrl(url);
          });
      }
    });

    this.openModal();
  }

  openModal() {
    this.viewModal = true
  }

  fadeToggle(element: HTMLElement) {
    element.classList.toggle('active');
  }

  closeModal() {
    this.viewModal = false
    this.pedido = {id: 0, numeroDoPedido: 0, produtos: [], descricao: '', tipoDePagamento: 'cartão',
      troco: '',
      endereco: undefined,}
  }
}
