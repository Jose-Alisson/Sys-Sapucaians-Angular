import { TypePay } from 'src/app/model/typePay';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Endereco } from 'src/app/model/endereco.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PedidoService } from './../../shared/services/pedido.service';
import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/model/pedido.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagemService } from 'src/app/shared/services/imagem.service';
import { SignService } from 'src/app/shared/services/sign-service.service';

@Component({
  selector: 'app-payment-my-product',
  templateUrl: './payment-my-product.component.html',
  styleUrls: ['./payment-my-product.component.scss'],
})
export class PaymentMyProductComponent implements OnInit {
  pedido: Pedido = {};

  addressForm!: FormGroup;

  isDispatch: boolean = false
  addressWrapperActive = false

  allErrorVisibleForm: boolean = false

  allAddress?: Endereco []
  addressSelected?: Endereco

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private pedidoServ: PedidoService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private imgService: ImagemService,
    private sanitizer : DomSanitizer,
    private sign: SignService,
  ) {}

  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      nomeDoEndereco: [null, Validators.required],
      cep: [null],
      localidade: [null, Validators.required]
    });

    this.actRoute.queryParams.subscribe((params) => {
      let param = params['pedido_id'];
      let tokenForChange = params['token_for_change']

      if (param) {
        this.pedidoServ.findById(param).subscribe({
          next: (data) => {
            if(data){
              this.pedido = data;
              data.qproducts?.forEach(qProd => {

                qProd.product?.photoUrl?.forEach(photoUrl => {
                  this.imgService.downloadImagem(photoUrl ?? '').subscribe(d => {
                  if(qProd.product){
                    qProd.product.photoObject?.push(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(d)))
                  }
                })
                })

              })
            }
          },
          error: (err: HttpErrorResponse) => {
            this.toast.error('Error' + err.status, 'Error');
          },
        });
      }
    });
  }

  getSubTotal() {
    let value = 0;
    if (this.pedido) {
      this.pedido.qproducts?.forEach((prod) => {
        value += (prod.product?.price ?? 0) * (prod.quantity ?? 0);
      });
    }
    return value;
  }

  setFormPay(formPay: string) {
    this.pedido.typesPay = [{typePay: formPay}]
  }

  setFormDispatch(formDispatch: boolean ) {
    this.isDispatch = formDispatch
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

  getAddress(){
    let auth = this.sign.auth

    if(auth.user){
      return auth.user.addresses
    }

    this.actRoute.queryParams.subscribe(params => {

    })

    return []
  }

  selectPay(indexCard:number){
    let cardPay = document.querySelectorAll(`.card-payment`)
    cardPay.forEach((card, index) => {
      (card.querySelector('.pay-select-radio') as HTMLDivElement).removeAttribute('checked')

      if(indexCard - 1 === index){
        (card.querySelector('.pay-select-radio') as HTMLDivElement).setAttribute('checked', '')
      }
    })
  }

  payIsSelected(indexCard:number){
    let cardPay = document.querySelectorAll(`.card-payment`);
    let isSelected = (cardPay[indexCard - 1].querySelector('.pay-select-radio') as HTMLDivElement).hasAttribute('checked')
    return isSelected
  }

  getValorTotal(){
    let valortotal = 0

    this.pedido.qproducts?.forEach(qProd => {
      valortotal += ((qProd.product?.price ?? 0) * (qProd?.quantity ?? 0))
    })

    valortotal += this.addressSelected?.price ?? 0

    return valortotal
  }

  expandPayContent(actived : boolean, element: HTMLDivElement){
    let children = element.querySelector('section')

    if(actived){
      return {'height': children?.offsetHeight + 'px'}
    }

    return {'height': 0}
  }

   finalizarPedido(){
    this.pedido.state = "Em Andamento"
    this.pedidoServ.salvar(this.pedido).then(d => d.subscribe({next: (ped) => {
      console.log(ped)
      this.toast.success('Pedido Implantado com Sucesso')
      this.router.navigate(['dash-board', 'cart-queue'])
    }}))
   }
}

