import { ModeloProduto } from './../../../model/modelProduct';
import { ModeloProdutoService } from './../../../shared/services/modelo-produto.service';
import { PedidoService } from 'src/app/shared/services/pedido.service';
import { ProdutoService } from './../../../shared/services/produto.service';
import { PrintService } from './../../../shared/services/print.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagemService } from './../../../shared/services/imagem.service';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  TemplateRef,
  Type,
  ViewChild,
} from '@angular/core';
import { Pedido } from 'src/app/model/pedido.model';
import { QuantidadeProduto } from 'src/app/model/quantidade.model';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Endereco } from 'src/app/model/endereco.model';
import { TypePay } from 'src/app/model/typePay';
import { Produto } from 'src/app/model/Produto.model';
import { OrderState } from 'src/app/model/OrderState';
import { RadioListComponent } from 'src/app/shared/comps/radio-list/radio-list.component';
import { OrderItem } from 'src/app/model/OrderItem';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shopping-box',
  templateUrl: './shopping-box.component.html',
  styleUrls: ['./shopping-box.component.scss'],
})
export class ShoppingBoxComponent implements OnInit {
  text = '';

  allPedidos: Pedido[] = [];
  pedidoSelected: Pedido = {
    typesPay: [],
  };

  prodSelected?: QuantidadeProduto;
  rowSelected?: number;
  caixa: QuantidadeProduto[] = [];
  page?: string = 'box';
  pays?: TypePay[] = [];

  viewModalUsuario = false;
  viewModalAddress = false;
  viewModalSelectProduct = false;
  viewModalSelectMesa = false;
  viewModalPagamento = false;

  @ViewChild('box', { static: true })
  boxTemplate!: TemplateRef<any>;

  @ViewChild('payment', { static: true })
  paymentTemplate!: TemplateRef<any>;

  @ViewChild('cardProductTable', { static: true })
  cardTable?: ElementRef<HTMLDivElement>;

  @ViewChild('commandOperator', { static: true })
  commandOperator!: TemplateRef<any>;

  deliveryForm!: FormGroup;
  clientForm!: FormGroup;
  pagamenteForm!: FormGroup[];

  constructor(
    private pedService: PedidoService,
    private formBuilder: FormBuilder,
    private imgService: ImagemService,
    private sanitizer: DomSanitizer,
    private print: PrintService,
    private toastr: ToastrService,
    private prodService: ProdutoService,
    private actRouter: ActivatedRoute,
    private modeloService: ModeloProdutoService
  ) {}

  ngOnInit(): void {
    this.deliveryForm = this.formBuilder.group({
      nameAddress: [null, []],
      houseNumber: [null, []],
      locality: [null, []],
      price: [null, []],
    });

    this.clientForm = this.formBuilder.group({
      contact: [null, []],
      name: [null, []],
    });

    this.actRouter.queryParams.subscribe((data) => {
      let id = data['load_order'];
      if (id != undefined) {
        this.pedService.findById(id).subscribe({
          next: (order) => {
            this.pedidoSelected = order;
            this.caixa = this.pedidoSelected.qproducts ?? [];
            this.toastr.success(
              'Sucesso ao carregar pedido',
              'Carregamento de Pedido'
            );
          },
          error: (err: HttpErrorResponse) => {
            this.toastr.error(
              'Erro ao tentar carregar pedido',
              'Carregamento de Pedido'
            );
          },
        });
      }
    });

    // this.pedService.findAll().subscribe((data) => {
    //   data.forEach((pedido) => {
    //     pedido.qProducts?.forEach((prod) => {
    //       this.imgService
    //         .downloadImagem(prod.product?.photoUrl ?? '')
    //         .subscribe({
    //           next: (blob) => {
    //             if (prod.product) {
    //               prod.product.photoObject =
    //                 this.sanitizer.bypassSecurityTrustUrl(
    //                   URL.createObjectURL(blob)
    //                 );
    //             }
    //           },
    //           error: () => {},
    //         });
    //     });
    //   });

    //   this.allPedidos = data;
    // });
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    console.log('oie');

    event.preventDefault();
    return 'Tem certeza que deseja sair da página? Suas alterações não serão salvas.';
  }

  getSubTotal() {
    let value = 0;

    this.caixa.forEach((prod) => {
      value += (prod.product?.price ?? 0) * (prod.quantity ?? 0);
    });

    return value;
  }

  printPedido(id: number | null | undefined) {
    if (id) {
      this.print.printarPedido(id).subscribe({
        next: () => {
          this.toastr.success(
            'Sucesso, Imprimindo pedido de id:' + id,
            'Sucesso - Imprimindo'
          );
        },
        error: () => {
          this.toastr.error(
            'Error, ao tentar imprimir pedido de id:' + id,
            'Error de impressao'
          );
        },
      });
    }
  }

  actionFinally = false;

  //@HostListener('window:keydown', ['$event'])
  catchBoard(event: KeyboardEvent) {
    const blockedChars = ['*', '/']; // bloquerar caracteres a 1 unico caracter na busca
    const allowedKeys = [
      '*',
      '/',
      'Enter',
      'Backspace',
      '#',
      'ArrowLeft',
      'ArrowRight',
      '$',
    ]; // caracteres permitidos
    const key = event.key;

    //console.log(key)
    if (this.actionFinally) {
      this.text = '';
      this.actionFinally = false;
      this.prodSelected = undefined;
    }

    if (!allowedKeys.includes(key) && !this.isNumberKey(key)) {
      event.preventDefault(); // Impede a entrada de teclado inválida
    }

    if (key === 'Enter') {
      if (this.text.includes('*')) {
        let split = this.text.split('*');
        this.prodService.findById(parseInt(this.text)).subscribe({
          next: (result) => {
            result.photoUrl?.forEach((photo) => {
              this.imgService.downloadImagem(photo).subscribe((blob) => {
                result.photoObject?.push(
                  this.sanitizer.bypassSecurityTrustUrl(
                    URL.createObjectURL(blob)
                  )
                );
              });
            });
            this.setProductInCaixa({
              product: result,
              quantity: parseInt(split[1]),
            });
          },
        });
      } else {

        var id = parseInt(this.text);

        if(!Number.isNaN(id)){

          this.prodService.findById(id).subscribe({
          next: (result) => {
            result.photoUrl?.forEach((photo) => {
              this.imgService.downloadImagem(photo).subscribe((blob) => {
                result.photoObject?.push(
                  this.sanitizer.bypassSecurityTrustUrl(
                    URL.createObjectURL(blob)
                  )
                );
              });
            });

            let modelosId = this.text.split('$');
            modelosId.shift();

            let modelos: ModeloProduto[] = [];

            modelosId.forEach((modelo, index) => {
              let categoria = result.categoriaSelectors?.find((obj, i) => i === index)

              if(categoria){
                let idIndexModelo = modelo.split('#')

                idIndexModelo.forEach((n, ind) => {
                  if(ind <= (categoria?.numberSelections ?? 0)){

                    let j  = categoria?.rmodelsProduts?.find((h) => h.idIndex === parseInt(n))

                    if(j){
                       modelos.push(j)
                    }
                  }
                })
              }
            })

            this.setProductInCaixa({
              product: result,
              quantity: 1,
              rmodelsProduts: modelos,
            });
          },
        });
        } else {
          this.toastr.error('Expressão invalid')
        }
      }
    }

    if (blockedChars.includes(key)) {
      let blocked = false;
      blockedChars.forEach((char) => {
        if (this.text.includes(char)) {
          blocked = true;
        }
      });
      if (blocked) {
        event.preventDefault(); // Impede a entrada de teclado inválida
      }
    }
  }

  isNumberKey(key: string): boolean {
    return /^\d$/.test(key);
  }

  @HostListener('window:keyup', ['$event'])
  keyup(event: KeyboardEvent) {}

  setProductInCaixa(qProd: QuantidadeProduto) {
    if ((qProd.quantity ?? 0) > 1) {
      this.text = `${qProd.product?.nameProduct} X${qProd.quantity}`;
    } else {
      this.text = `${qProd.product?.nameProduct}`;
    }
    this.prodSelected = qProd;
    this.caixa.push(qProd);
    this.actionFinally = true;
  }

  getTotal() {
    let value = 0;
    this.caixa.forEach((prod) => {
      value += (prod.product?.price ?? 0) * (prod.quantity ?? 0);
    });
    return value;
  }

  selectRowProduct(index: number) {
    this.rowSelected = index;
    console.log(this.rowSelected);
  }

  isRowSelected(index: number) {
    return this.rowSelected == index;
  }

  cardTableScroll() {
    let cardElement = this.cardTable?.nativeElement;
    if (cardElement) {
      let rowsSelected = cardElement.querySelector('.row-selected');
      if (rowsSelected) {
        let tdChildren = rowsSelected?.children[0] as HTMLTableCellElement;

        if (tdChildren) {
          const posCard = tdChildren.offsetTop - cardElement.offsetTop;
          const posCenter =
            posCard -
            cardElement.offsetHeight / 2 +
            tdChildren.offsetHeight / 2;
          cardElement.scrollTo({ top: posCenter, behavior: 'smooth' });
        }
      }
    }
  }

  navigateTo(name: string) {
    this.page = name;
  }

  setToggleWrapperActive(wrapperName: string, index: number) {
    document
      .querySelector('#' + wrapperName + index)
      ?.toggleAttribute('active');
  }

  setWrapperValue(pay: TypePay, value: string) {
    pay.typePay = value;
  }

  addPayOption() {
    this.pays?.push({});
  }

  removePayOption(index: number) {
    /*let pays: TypePay[] = [...this.pedidoSelected.typesPay??[],...this.pays ??[]]

    let length = this.pedidoSelected.typesPay?.length ?? 0
    if(length - 1 < index){*/
    this.pedidoSelected.typesPay = this.pedidoSelected.typesPay?.filter(
      (typePay, ind) => ind !== index
    );
    // } else {
    this.pays = this.pays?.filter(
      (typePay, ind) =>
        ind != index - (this.pedidoSelected.typesPay?.length ?? 0 - 1)
    );
    // }
  }

  removeProduct(index: number) {
    this.caixa = this.caixa.filter((p, i) => i != index);
  }

  getTroco() {
    let total = this.getValorTotal();

    this.pedidoSelected.typesPay?.forEach((pay) => {
      total -= pay?.value ?? 0;
    });

    return +total;
  }

  setPaying(pay: TypePay, value: boolean) {
    console.log(pay);
    pay.isPaying = value;
  }

  getRLValue(radioList: RadioListComponent) {
    return radioList.values;
  }

  getRLValueContains(radioList: RadioListComponent, value: any) {
    return radioList.values.find((value_) => value_ === value);
  }

  ////////////////////////////////////////

  isDispatch: boolean = false;
  addressWrapperActive = false;

  allErrorVisibleForm: boolean = false;

  allAddress?: Endereco[];
  addressSelected?: Endereco;

  setFormDispatch(formDispatch: boolean) {
    this.isDispatch = formDispatch;
    if (formDispatch === false) {
      this.pedidoSelected.address = undefined;
    }

    if (formDispatch == true) {
    }
  }

  getInteractionForm(formGrop: FormGroup, controlName: string) {
    let control = formGrop.get(controlName);
    return control?.touched || control?.dirty;
  }

  isValidControlForm(formGrop: FormGroup, controlName: string) {
    if (formGrop?.get(controlName)) {
      let control = formGrop.get(controlName);
      if (control?.errors === null) {
        return false;
      }
      return control?.errors && this.getInteractionForm(formGrop, controlName);
    }
    return false;
  }

  getAddress() {
    return [];
  }

  selectPay(indexCard: number) {
    let cardPay = document.querySelectorAll(`.card-payment`);
    cardPay.forEach((card, index) => {
      (
        card.querySelector('.pay-select-radio') as HTMLDivElement
      ).removeAttribute('checked');

      if (indexCard - 1 === index) {
        (
          card.querySelector('.pay-select-radio') as HTMLDivElement
        ).setAttribute('checked', '');
      }
    });
  }

  payIsSelected(indexCard: number) {
    let cardPay = document.querySelectorAll(`.card-payment`);
    let isSelected = (
      cardPay[indexCard - 1].querySelector(
        '.pay-select-radio'
      ) as HTMLDivElement
    ).hasAttribute('checked');
    return isSelected;
  }

  getValorTotal() {
    let valortotal = 0;

    this.caixa?.forEach((qProd) => {
      valortotal += (qProd.product?.price ?? 0) * (qProd?.quantity ?? 0);
    });

    valortotal += this.pedidoSelected.address?.price ?? 0;

    return valortotal;
  }

  getAllTypesPay() {
    let paysName: TypePay[] = [];
    this.pedidoSelected.typesPay?.forEach((pay) => {
      const existe = paysName.some((pay_) => pay_.typePay === pay.typePay);
      if (!existe) {
        paysName.push(pay);
      }
    });
    return paysName;
  }

  getOrderPays() {
    let pays: TypePay[] = [
      ...(this.pedidoSelected.typesPay ?? []),
      ...(this.pays ?? []),
    ];

    return pays;
  }

  adicionarCliente() {
    this.pedidoSelected.user = this.clientForm.value;
    this.viewModalUsuario = false;
  }

  adicionarEndereco() {
    this.pedidoSelected.address = this.deliveryForm.value;
    this.viewModalAddress = false;
  }

  adicionarPagamento() {
    this.pays?.forEach((pay) => this.pedidoSelected.typesPay?.push(pay ?? {}));
    this.pays = [];
    this.viewModalPagamento = false;
  }

  implatarPedido() {
    if (this.caixa.length > 0) {
      this.pedidoSelected.qproducts = this.caixa;
      this.pedidoSelected.state = 'Em Andamento';

      this.pedService.salvar(this.pedidoSelected).then((d) =>
        d.subscribe({
          next: (_data) => {
            if (this.pedidoSelected.creationDate != undefined) {
              this.toastr.success(
                'Sucesso ao Salvar pedido',
                'Atualização de Pedido'
              );
            } else {
              this.toastr.success(
                'Sucesso ao implantar pedido',
                'Implatamento de Pedido'
              );
            }

            this.caixa = [];
            this.pedidoSelected = {
              typesPay: [],
            };
            this.text = '';

            console.log(_data);
            this.page = 'box';
          },
        })
      );
    }
  }

  getModeloFomatedName(modelos: ModeloProduto[]) {
    let name = '';
    modelos.forEach((modelo, index) => {
      name += `${index === 0? '' : ','}` + modelo.modelName;
    });

    return `(${name})`;
  }
}
