import { Produto } from 'src/app/model/Produto.model';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { QuantidadeProduto } from 'src/app/model/quantidade.model';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss'],
})
export class ProdutoComponent implements OnInit, AfterViewInit {
  @ViewChild('viewProduct', { static: true })
  viewProduct?: ElementRef;

  @Input()
  produtos?: Produto[];

  @Input()
  quantidades?: QuantidadeProduto[];

  @Input()
  countView: boolean = false;

  @Input()
  produto?: Produto;

  @Output()
  remover = new EventEmitter<number>();

  @Output()
  adicionar = new EventEmitter<QuantidadeProduto>();

  @Output()
  fade = new EventEmitter<void>();

  @ViewChild('modal', { static: true })
  modal!: ElementRef;

  @Input()
  quantidade: QuantidadeProduto = {
    id: 0,
    produto: this.produto,
    quantidade: 1,
  };

  constructor() {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    const minhaImagem = <HTMLImageElement>this.viewProduct?.nativeElement;

    function atualizarEstiloBorda() {
      if (minhaImagem.naturalWidth > minhaImagem.naturalHeight) {
        minhaImagem.style.width = '100%';
        minhaImagem.style.maxHeight = '244px';
        //minhaImagem.style.maxHeight = "auto";
      } else {
        minhaImagem.style.maxHeight = '244px';
        minhaImagem.style.width = 'auto';
      }
    }

    const observer = new MutationObserver(function (mutationsList) {
      for (let mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'src'
        ) {
          atualizarEstiloBorda();
        }
      }
    });

    observer.observe(minhaImagem, { attributes: true });

    atualizarEstiloBorda();
  }

  aumentarQuatidade() {
    if (this.quantidade.quantidade < 10) {
      this.quantidade.quantidade += 1;
    }
  }

  diminuirQuantidade() {
    if (this.quantidade.quantidade > 1) {
      this.quantidade.quantidade -= 1;
    }
  }

  diminuirQuantidadeRemover() {
    if (this.quantidade.quantidade > 1) {
      this.quantidade.quantidade -= 1;
    } else {
      this.remover.emit(this.quantidade.produto?.id);
    }
  }

  exibirModal(quant: QuantidadeProduto) {
    let quanti = this.quantidades?.find(
      (qproduto) => qproduto.produto?.id === quant.produto?.id
    );

    if (quanti) {
      this.quantidade = quanti;
    }

    if (!this.countView) {
      this.quantidade = quant;

      (this.modal.nativeElement as HTMLElement).classList.add('active');
      this.fade.emit();
    }
  }

  esconderModal() {
    (this.modal.nativeElement as HTMLElement).classList.remove('active');
    this.fade.emit();
  }

  adicionarProduto() {
    this.adicionar.emit(this.quantidade);
    this.esconderModal();

    this.quantidade.quantidade = 1;
  }

  getProduct() {
    if (this.produtos) {
      this.quantidades = [];
      this.produtos!.forEach((produto_) => {
        this.quantidades?.push({ id: 0, produto: produto_, quantidade: 1 });
      });
    }

    return this.quantidades;
  }

  selectProduct(element: HTMLDivElement, event: Event){
    event.stopPropagation();
    element.dispatchEvent(new Event('click'));
  }
}
