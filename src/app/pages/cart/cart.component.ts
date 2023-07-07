import { SignService } from './../../shared/services/sign-service.service';
import { ImagemService } from './../../shared/services/imagem.service';
import { PedidoService } from './../../shared/services/pedido.service';
import { ProdutoService } from './../../shared/services/produto.service';

import { Pedido } from './../../model/pedido.model';

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Produto } from 'src/app/model/Produto.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { QuantidadeProduto } from 'src/app/model/quantidade.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {
  cart: QuantidadeProduto[] = [];

  filterModalActive = false;
  filterProduct: QuantidadeProduto[] = [];
  allProduct?: QuantidadeProduto[];
  productSelected?: Produto;
  filterCategory = 'all';

  viewCardWrapper = false;
  viewSideBarCart = false;

  constructor(
    private form: FormBuilder,
    private prodService: ProdutoService,
    private imgService: ImagemService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private pedidoService: PedidoService,
    private sign: SignService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.prodService.getAllProduct().subscribe({
      next: (prods) => {
        this.allProduct = [];
        prods.forEach((prod) => {
          if (prod.inStock && prod.inStock > 0) {

            prod.photoUrl?.forEach(photo => {
              this.imgService.downloadImagem(photo).subscribe({
                next: (blob) => {
                  prod?.photoObject?.push(this.sanitizer.bypassSecurityTrustUrl(
                    URL.createObjectURL(blob)
                  ));
                },
                error: (error: HttpErrorResponse) => {
                  console.log(error);
                },
              });
            })

            this.allProduct!.push({ product: prod, quantity: 1 });
          }
        });
        this.filterProduct = this.allProduct;
      },
      error: (error: HttpErrorResponse) => {
        //this.toastr.error('Não foi possivel carregar os produtos: StatusCode: ' + error.statusText, 'Error' )
      },
    });

    this.activeRouter.queryParams.subscribe((data) => {
      if (data?.['cart_active']) {
        this.viewCardWrapper = true;
      }

      if (data?.['action']) {
        if (data?.['action'] === 'add') {
        }
      }

      console.log(data);
    });
  }

  setCategory(category: string) {
    this.filterCategory = category;
    if (category === 'all') {
      this.filterProduct = this.allProduct!;
    } else {
      this.filterProduct = this.allProduct!.filter((prod) => {
        if (prod.product) {
          return prod.product.category == category;
        }
        return false;
      });
    }
    this.filterModalActive = false;
  }

  getAllCetegory() {
    const categorys: string[] = [];
    this.allProduct?.forEach((prod) => {
      if (prod.product && !categorys.includes(prod.product.category ?? '')) {
        categorys.push(prod.product.category ?? '');
      }
    });
    return categorys;
  }

  seachProductos(input: HTMLInputElement) {
    if (input.value !== '') {
      if (this.filterCategory === 'all') {
        this.filterProduct =
          this.allProduct?.filter((prod) => {
            if (prod.product) {
              return (prod.product.nameProduct ?? '')
                .toLowerCase()
                .includes(input.value.toLowerCase());
            }
            return false;
          }) ?? [];
      } else {
        this.filterProduct =
          this.allProduct?.filter((prod) => {
            if (prod.product) {
              (prod.product.nameProduct ?? '')
                .toLowerCase()
                .includes(input.value.toLowerCase()) &&
                prod.product.category === this.filterCategory;
            }
            return false;
          }) ?? [];
      }
    } else {
      if (this.filterCategory != 'all') {
        this.filterProduct =
          this.allProduct?.filter((prod) => {
            if (prod.product) {
              prod.product.category === this.filterCategory;
            }
            return false;
          }) ?? [];
      } else {
        this.filterProduct = this.allProduct ?? [];
      }
    }
  }

  aiv(index: number) {
    let img = document.querySelector(
      `#card-${index} .card-imagem img`
    ) as HTMLImageElement;
    if (img) {
      let width = img.naturalWidth;
      let heigth = img.naturalHeight;

      if (width > heigth) {
        return true;
      }
    }
    return false;
  }

  spandModal() {
    return this.productSelected;
  }

  decrementar(qProd: QuantidadeProduto) {
    if (qProd.quantity && qProd.quantity > 1) {
      qProd.quantity -= 1;
      return;
    }

    if (
      this.cart.findIndex((prod) => prod.product?.idProduct === qProd.product?.idProduct) !=
      -1
    ) {
      this.cart = this.cart.filter(
        (prod) => prod.product?.idProduct !== qProd.product?.idProduct
      );
    }
  }

  incrementar(qProd: QuantidadeProduto) {
    if (qProd.quantity && qProd.quantity < 10) {
      qProd.quantity += 1;
    }
  }

  addToCart(qProd: QuantidadeProduto) {
    let eProd = this.cart.find(
      (prod) => prod.product?.idProduct === qProd.product?.idProduct
    );

    if (eProd) {
      eProd.quantity = qProd.quantity;
    } else {
      this.cart.push(qProd);
    }

    console.log(this.cart);
  }

  toggleViewCartWrapper() {
    this.viewCardWrapper = !this.viewCardWrapper;
  }

  toggleViewSideBar() {
    this.viewSideBarCart = !this.viewSideBarCart;
  }

  getSubTotal() {
    let value = 0;
    this.cart.forEach((prod) => {
      value += (prod.product?.price ?? 0) * (prod.quantity ?? 0);
    });
    return value;
  }

  passRequest() {
    if (this.cart.length > 0) {
      let user = this.sign.auth.user;

      //console.log({ qproducts: this.cart, user: auth.user } as Pedido)

      this.pedidoService
        .salvar({
          id: 0,
          qproducts: this.cart,
          user: {
            id: user?.id,
            name: user?.name,
            lastName: user?.lastName,
            contact: user?.contact,
          },
        } as Pedido)
        .then((d) =>
          d.subscribe({
            next: (pedido) => {
              console.log(pedido);
              this.toastr.success('Sucesso ao criar pedido', 'Sucesso');
              this.router.navigate([`checkout`], {
                queryParams: { pedido_id: pedido.id },
              });
            },
            error: (err: HttpErrorResponse) => {
              this.toastr.error('Error ao criar pedido', 'Error');
              console.log(err);
            },
          })
        );
    }
  }

  isSelected(id: number | null | undefined) {
    if (id) {
      return this.cart.findIndex((prod) => prod.product?.idProduct === id) !== -1;
    }
    return false;
  }

  getAllProductByCategory(category: string) {
    return (
      this.allProduct?.filter((prod) => prod.product?.category === category) ??
      []
    );
  }
}
