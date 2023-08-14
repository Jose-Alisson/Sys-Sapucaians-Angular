import { TypePay } from 'src/app/model/typePay';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Endereco } from 'src/app/model/endereco.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PedidoService } from './../../shared/services/pedido.service';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Pedido } from 'src/app/model/pedido.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagemService } from 'src/app/shared/services/imagem.service';
import { SignService } from 'src/app/shared/services/sign-service.service';
import { Produto } from 'src/app/model/Produto.model';
import { exValoresDaTaxa } from '../about/about.component';
import { ModeloProduto } from 'src/app/model/modelProduct';
import { QuantidadeProduto } from 'src/app/model/quantidade.model';

@Component({
  selector: 'app-payment-my-product',
  templateUrl: './payment-my-product.component.html',
  styleUrls: ['./payment-my-product.component.scss'],
})
export class PaymentMyProductComponent implements OnInit {
  pedido: Pedido = {};

  addressForm!: FormGroup;

  isDispatch: boolean = false;
  addressWrapperActive = false;

  allErrorVisibleForm: boolean = false;

  allAddress?: Endereco[];

  addressSelected?: Endereco;


  addressModalActive = false;
  addressRegisterModal = false;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private pedidoServ: PedidoService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private imgService: ImagemService,
    private sanitizer: DomSanitizer,
    private sign: SignService
  ) {}

  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      nameAddress: [null, Validators.required],
      houseNumber: [null, []],
      zipCode: [null, []],
      locality: [null, Validators.required],
      complement: [null, []],
    });

    this.actRoute.queryParams.subscribe((params) => {
      let param = params['pedido_id'];
      let tokenForChange = params['token_for_change'];

      if (param) {
        this.pedidoServ.findById(param).subscribe({
          next: (data) => {
            if (data) {
              this.pedido = data;

              this.isDispatch = data.address != undefined ? true : false;

              data.typesPay?.forEach((pay) => {
                switch (pay.typePay) {
                  case 'Dinheiro':
                    this.selectPay(1);
                    break;
                  case 'Pix':
                    this.selectPay(2);
                    break;
                  case 'Cartao':
                    this.selectPay(3);
                    break;
                  default:
                    break;
                }

                data.qproducts?.forEach((qProd) => {
                  if (qProd.product) {
                    qProd.product.photoObject = [];
                    qProd.product.photoUrl?.forEach((url, i) => {
                      if (i === 0) {
                        this.imgService.downloadImagem(url).subscribe({
                          next: (blob) => {
                            qProd.product?.photoObject?.push(
                              this.sanitizer.bypassSecurityTrustUrl(
                                URL.createObjectURL(blob)
                              )
                            );
                          },
                          error: (error: HttpErrorResponse) => {
                            console.log(error);
                          },
                        });
                      }
                    });
                  }
                });
              });
            }
          },
          error: (err: HttpErrorResponse) => {
            this.toast.error('Error' + err.status, 'Error');
          },
        });
      }
    });
  }

  // getSubTotal() {
  //   let value = 0;
  //   if (this.pedido) {
  //     this.pedido.qproducts?.forEach((prod) => {
  //       value += (prod.product?.price ?? 0) * (prod.quantity ?? 0);
  //     });
  //   }
  //   return value;
  // }

  getSubTotal() {
    let value = 0;
    this.pedido.qproducts?.forEach((prod) => {

      let valorProduto = 0

      prod.rmodelsProduts?.forEach(modelos => {
        valorProduto += modelos.amountValue ?? 0
      })

      value += ((prod.product?.price ?? 0) + valorProduto) * (prod.quantity ?? 0);
    });
    return value;
  }

  setFormPay(formPay: string) {
    this.pedido.typesPay = [{ typePay: formPay }];
  }

  setFormDispatch(formDispatch: boolean) {
    this.isDispatch = formDispatch;
  }

  getInteractionForm(formGrop: FormGroup, controlName: string) {
    let control = formGrop.get(controlName);
    return control?.touched || control?.dirty || this.allErrorVisibleForm;
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
    let auth = this.sign.auth;

    if (auth.user) {
      return auth.user.addresses ?? [];
    }

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

    this.pedido.qproducts?.forEach((qProd) => {
      valortotal += (qProd.product?.price ?? 0) * (qProd?.quantity ?? 0);
    });

    valortotal += this.addressSelected?.price ?? 0;

    return valortotal;
  }

  expandPayContent(actived: boolean, element: HTMLDivElement) {
    let children = element.querySelector('section');

    if (actived) {
      return { height: children?.offsetHeight + 'px' };
    }

    return { height: 0 };
  }

  finalizarPedido() {
    this.pedido.state = 'Em Andamento';
    this.pedidoServ.salvar(this.pedido).then((d) =>
      d.subscribe({
        next: (ped) => {
          console.log(ped);
          this.toast.success('Pedido Implantado com Sucesso');
          this.router.navigate(['dash-board', 'cart-queue']);
        },
      })
    );
  }

  alterarCarrinho() {
    this.router.navigate(['dash-board', 'menu'], {
      queryParams: {
        load_cart_id: this.pedido.id,
      },
    });
  }

  getFirstImageUrl(produto: Produto) {
    let img = produto.photoObject?.find((p, i) => i === 0);
    return img;
  }

  getLocalidades(){
    return exValoresDaTaxa;
  }

  getTotalProdutoSelection(qProd: QuantidadeProduto){
    let valor = 0;

    valor += qProd.product?.price ?? 0;
    // qProd.product?.categoriaSelectors?.forEach(category => {
    //   category.modeloSelected?.forEach(modelo => {
    //     valor += modelo.modelo?.amountValue ?? 0
    //   })
    // })

    qProd.rmodelsProduts?.forEach(modelos => {
      valor += modelos.amountValue ?? 0
    })

    return valor * (qProd.quantity ?? 0);
  }

  getModeloFomatedName(modelos: ModeloProduto[]) {
    let name = '';
    modelos.forEach((modelo, index) => {
      name += `${index === 0 ? '' : ','}` + modelo.modelName;
    });

    return `(${name})`;
  }
}
