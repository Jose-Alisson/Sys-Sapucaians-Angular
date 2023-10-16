import { alterPedidoService } from './../orders-list/orders-list.component';
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
import { OrderState } from 'src/app/model/OrderState';
import { RadioListComponent } from 'src/app/shared/comps/radio-list/radio-list.component';
import { OrderItem } from 'src/app/model/OrderItem';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, observable, of } from 'rxjs';
import { Produto } from 'src/app/model/Produto.model';

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
    printate: 0,
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

  concluir = true

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

  @ViewChild('command', { static: false })
  command!: ElementRef<HTMLInputElement>;

  autoConcluir$: Observable<any[]> = of();

  constructor(
    private pedService: PedidoService,
    private formBuilder: FormBuilder,
    private imgService: ImagemService,
    private sanitizer: DomSanitizer,
    private print: PrintService,
    private toastr: ToastrService,
    private prodService: ProdutoService,
    private actRouter: ActivatedRoute,
    private modeloService: ModeloProdutoService,
    private alterPedidoService: alterPedidoService
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

            this.clientForm.setValue({
              name: order.user?.name,
              contact: order.user?.contact,
            });

            if (order.address != undefined) {
              this.isDispatch = true;

              this.deliveryForm.setValue({
                nameAddress: order.address?.nameAddress,
                houseNumber: order.address?.houseNumber,
                locality: order.address?.locality,
                price: order.address?.price,
              });
            }

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

    this.prodService
        .isContains('', NaN)
        .pipe(
          map((data) =>
            data.map((item) => ({
              index: item.idProduct,
              indexName:
                item.nameProduct +
                ` ${
                  (item.categoriaSelectors?.length ?? 0) > 0
                    ? `${
                        (item.categoriaSelectors?.length ?? 0) >= 2
                          ? ' - Contem categorias'
                          : ' - Contem Categoria'
                      }`
                    : ''
                }`,
            }))
          )
        )
        .subscribe((data) => {
          this.autoConcluir$ = new Observable<any[]>((observable) => {
            observable.next(data);
            observable.complete();
          });
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

    // setInterval(() => {

    //   this.buscar()

    // }, 100);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    // console.log('oie');
    event.preventDefault();
    return 'Tem certeza que deseja sair da página? Suas alterações não serão salvas.';
  }

  getSubTotal() {
    let value = 0;

    this.caixa.forEach((prod) => {
      let modelValue = 0;

      prod.rmodelsProduts?.forEach((modelos) => {
        modelValue += modelos.amountValue ?? 0;
      });

      value += (prod.product?.price ?? 0 + modelValue) * (prod.quantity ?? 0);
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
      ',',
      'ArrowLeft',
      'ArrowRight',
      '.',
    ]; // caracteres permitidos
    const key = event.key;

    //console.log(key)
    if (this.actionFinally) {
      this.text = '';
      this.actionFinally = false;
      this.prodSelected = undefined;
    }

    if (
      !allowedKeys.includes(key) &&
      !this.isNumberKey(key) &&
      !this.isTextKey(key)
    ) {
      event.preventDefault(); // Impede a entrada de teclado inválida
    }

    if (key === 'Enter') {
      /*
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
      }*/

      var id = parseInt(this.text);

      if (!Number.isNaN(id)) {
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

            let modelosId = this.text.split('.');
            modelosId.shift();

            let modelos: ModeloProduto[] = [];

            modelosId.forEach((modelo, index) => {
              let categoria = result.categoriaSelectors?.find(
                (obj, i) => i === index
              );

              if (categoria) {
                let idIndexModelo = modelo.split(',');

                idIndexModelo.forEach((n, ind) => {
                  if (ind <= (categoria?.numberSelections ?? 0)) {
                    let j = categoria?.rmodelsProduts?.find(
                      (h) => h.idIndex === parseInt(n)
                    );
                    if (j) {
                      modelos.push(j);
                    }
                  }
                });
              }
            });

            let quantity = 1;

            if (this.text.includes('*')) {
              quantity = parseInt(this.text.split('*')[1]);
            }

            this.setProductInCaixa({
              product: result,
              quantity: quantity,
              rmodelsProduts: modelos,
            });
          },
        });
      } else {
        this.toastr.error('Expressão invalid');
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

  isTextKey(key: string): boolean {
    return /^[a-zA-Z]+$/.test(key);
  }

  isNumberText(key: string): boolean {
    return /^[0-9]+$/.test(key);
  }

  autoConcluir(event: KeyboardEvent) {
    let pontos = this.encontrarIndeces(this.text, '.');
    let pontosDividio = this.text.split('.');

    if (((event.target as HTMLInputElement).selectionStart ?? 0) > pontos[0]) {
      this.prodService
        .isContains(pontosDividio[0] ?? '', parseInt(pontosDividio[0] ?? '0'))
        .subscribe((data) => {
          let divisaoPontos = this.text.split('.');
          divisaoPontos.shift();

          let modelos: ModeloProduto[] = [];

          divisaoPontos.forEach((modelo, ind) => {
            let categoria = data[0].categoriaSelectors?.find(
              (o, i) => i === ind
            );
            let modelosContains: ModeloProduto[] = [];

            if (categoria) {
              let idIndexModelo = modelo.split(',');

              idIndexModelo.forEach((n, i, array) => {

                if (array.length <= (categoria?.numberSelections ?? 0)) {
                  let j = categoria?.rmodelsProduts?.find((h) => (h.idIndex + '').includes('' + parseInt(n)) || (h?.modelName ?? '').toLowerCase().includes(n?.toLowerCase() ?? ''));

                  if (j) {
                    modelosContains.push(j);
                  }
                }

                if (n === '' && array.length <= (categoria?.numberSelections ?? 0)) {
                  categoria?.rmodelsProduts?.forEach((modelo) => {
                    let index = modelosContains.findIndex(
                      (m) => m.idIndex === modelo.idIndex
                    );

                    if (index === -1) {
                      modelosContains.push(modelo);
                    }
                  });
                }
              });
            }

            modelos = modelosContains;
          });



          this.autoConcluir$ = new Observable<any[]>((observable) => {
            observable.next(modelos);
            observable.complete();
          }).pipe(
            map((data) =>
              data.map((item) => ({
                index: item.idIndex,
                indexName: item.modelName,
              }))
            )
          );
        });
    } else {
      this.prodService
        .isContains(pontosDividio[0] ?? '', parseInt(pontosDividio[0] ?? '0'))
        .pipe(
          map((data) =>
            data.map((item) => ({
              index: item.idProduct,
              indexName:
                item.nameProduct +
                ` ${
                  (item.categoriaSelectors?.length ?? 0) > 0
                    ? `${
                        (item.categoriaSelectors?.length ?? 0) >= 2
                          ? ' - Contem categorias'
                          : ' - Contem Categoria'
                      }`
                    : ''
                }`,
            }))
          )
        )
        .subscribe((data) => {
          this.autoConcluir$ = new Observable<any[]>((observable) => {
            observable.next(data);
            observable.complete();
          });
        });
    }
  }

  setProductInCaixa(qProd: QuantidadeProduto) {
    let name =
      (qProd.rmodelsProduts?.length ?? 0) > 0
        ? this.getModeloFomatedName(qProd?.rmodelsProduts ?? [])
        : '';
    if ((qProd.quantity ?? 0) > 1) {
      this.text = `${qProd.product?.nameProduct + name} X${qProd.quantity}`;
    } else {
      this.text = `${qProd.product?.nameProduct + name}`;
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
    pay.paying = value;
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
      let modeloValor = 0;

      qProd.rmodelsProduts?.forEach((modelo) => {
        modeloValor += modelo.amountValue ?? 0;
      });

      valortotal +=
        ((qProd.product?.price ?? 0) + modeloValor) * (qProd?.quantity ?? 0);
    });

    valortotal += this.pedidoSelected.address?.price ?? 0;

    return valortotal;
  }

  getSumModelos(quantidade: QuantidadeProduto) {
    let valor = 0;

    quantidade.rmodelsProduts?.forEach((modelo) => {
      valor += modelo.amountValue ?? 0;
    });

    return valor;
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
    this.pays?.forEach((pay) => {
      console.log(pay);
      this.pedidoSelected.typesPay?.push(pay ?? {});
    });
    this.pays = [];
    this.viewModalPagamento = false;
  }

  implatarPedido() {
    if (this.caixa.length > 0) {
      this.pedidoSelected.qproducts = this.caixa;
      this.pedidoSelected.typesPay = this.getOrderPays();
      this.pedidoSelected.state = 'Em Andamento';

      console.log(this.pedidoSelected);

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
            this.page = 'box';
            this.alterPedidoService.event.emit(_data);
            this.clientForm.setValue({});

            console.log(_data);
          },
        })
      );
    }
  }

  getModeloFomatedName(modelos: ModeloProduto[]) {
    let name = '';
    modelos.forEach((modelo, index) => {
      name += `${index === 0 ? '' : ','}` + modelo.modelName;
    });

    return `(${name})`;
  }

  getPhoneMask(phone: String) {
    let mask = '';

    if (phone.length <= 8) {
      mask = '0000-0000';
    } else if (phone.length <= 9) {
      mask = '0 0000-0000';
    } else if (phone.length <= 11) {
      mask = '(00) 0 0000-0000';
    } else {
      mask = '(000) 0 0000-0000';
    }

    return mask;
  }

  getConclusao() {
    return this.autoConcluir$;
  }

  encontrarIndeces(str: string, caracter: string) {
    const indices: number[] = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === caracter) {
        indices.push(i);
      }
    }
    return indices;
  }

  indeceMaior(indeces: number[], indece: number) {
    let eMaior = 0;

    for (let i = 0; i < indeces.length; i++) {
      if (indece >= indeces[i] && indece <= (indeces[i + 1] ?? 0)) {
        eMaior = indeces[i];
        break;
      }
    }
    return eMaior;
  }
}
