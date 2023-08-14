import { Pedido } from 'src/app/model/pedido.model';
import { SignService } from './../../shared/services/sign-service.service';
import { ImagemService } from './../../shared/services/imagem.service';
import { PedidoService } from './../../shared/services/pedido.service';
import { ProdutoService } from './../../shared/services/produto.service';

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
import { ModeloProduto } from 'src/app/model/modelProduct';
import { CategoriaModeloSelector } from 'src/app/model/CategoriaModeloSelector';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {

  pedido: Pedido = {};
  cart: QuantidadeProduto[] = [];

  filterModalActive = false;
  filterProduct: QuantidadeProduto[] = [];

  allProduct?: QuantidadeProduto[];
  productSelected?: QuantidadeProduto;
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
  ) {
    this.productSelected?.product?.categoriaSelectors?.forEach((cat) => {
      cat.category;
      cat.rmodelsProduts?.forEach((modelo) => {
        modelo.modelName;
      });
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.prodService.getAllProduct().subscribe({
      next: (prods) => {
        this.allProduct = [];
        prods.forEach((prod) => {
          if (prod.inStock && prod.inStock > 0) {
            prod.photoObject = [];
            prod.photoUrl?.forEach((url, i) => {
              if (i === 0) {
                this.imgService.downloadImagem(url).subscribe({
                  next: (blob) => {
                    prod?.photoObject?.push(
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
      if (data?.['load_cart_id']) {
        this.pedidoService.findById(data?.['load_cart_id']).subscribe({
          next: (pedido) => {
            this.pedido = pedido;
            this.cart = this.pedido.qproducts ?? [];

            this.cart.forEach((prod) => {
              if (prod.product) {
                prod.product.photoObject = [];
                prod.product.photoUrl?.forEach((url, i) => {
                  if (i === 0) {
                    this.imgService.downloadImagem(url).subscribe({
                      next: (blob) => {
                        prod.product?.photoObject?.push(
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
          },
          error: () => {},
        });
      }

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

    /* if (
      /*this.cart.findIndex((prod) => prod.product?.idProduct === qProd.product?.idProduct) != -1) {
      this.cart = this.cart.filter((prod) => prod.product?.idProduct !== qProd.product?.idProduct);
    }*/

    this.cart = this.cart.filter((prod) => prod != qProd);
  }

  incrementar(qProd: QuantidadeProduto) {
    if (qProd.quantity && qProd.quantity < 10) {
      qProd.quantity += 1;
    }
  }

  viewProductModal(qProd: QuantidadeProduto) {
    this.productSelected = {...qProd};
  }

  addToCart(qProd: QuantidadeProduto) {
    let prod = qProd;

    if (prod.rmodelsProduts === undefined) {
      prod.rmodelsProduts = [];
    }

    prod.product?.categoriaSelectors?.forEach((category) => {
      category.modeloSelected?.forEach((modeloSelected) => {
        let index = prod.rmodelsProduts?.findIndex(
          (mod) => mod.idIndex === modeloSelected.modelo?.idIndex
        );
        if (index != -1 && index != undefined) {
          prod.rmodelsProduts![index] = modeloSelected.modelo ?? {};
        } else {
          prod.rmodelsProduts?.push(modeloSelected.modelo ?? {});
        }
      });
    });

    this.cart.push({ ...prod });
    this.productSelected = undefined;

    qProd.product?.categoriaSelectors?.forEach(categoria => {
      categoria.modeloSelected = []
    })
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

      let valorProduto = 0

      prod.rmodelsProduts?.forEach(modelos => {
        valorProduto += modelos.amountValue ?? 0
      })

      value += ((prod.product?.price ?? 0) + valorProduto) * (prod.quantity ?? 0);
    });
    return value;
  }

  passRequest() {
    if (this.cart.length > 0) {
      let user = this.sign.auth.user;

      //console.log({ qproducts: this.cart, user: auth.user } as Pedido)

      this.pedido.user = user;
      this.pedido.qproducts = this.cart;

      this.pedidoService.salvar(this.pedido).then((d) =>
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
      return (
        this.cart.findIndex((prod) => prod.product?.idProduct === id) !== -1
      );
    }
    return false;
  }

  getAllProductByCategory(category: string) {
    return (
      this.allProduct?.filter((prod) => prod.product?.category === category) ??
      []
    );
  }

  getFirstImageUrl(produto: Produto) {
    let img = produto.photoObject?.find((p, i) => i === 0);
    return img;
  }


  getTotalProduto(qProd: QuantidadeProduto) {
    let valor = 0;
    valor += qProd.product?.price ?? 0;
    qProd.rmodelsProduts?.forEach((modelo) => {
      valor += modelo.amountValue ?? 0;
    });
    return valor * (qProd.quantity ?? 0);
  }

  getTotalProdutoSelection(qProd: QuantidadeProduto){
    let valor = 0;

    valor += qProd.product?.price ?? 0;
    qProd.product?.categoriaSelectors?.forEach(category => {
      category.modeloSelected?.forEach(modelo => {
        valor += modelo.modelo?.amountValue ?? 0
      })
    })

    return valor * (qProd.quantity ?? 0);
  }

  getInteration(quantidade: number) {
    return new Array(quantidade);
  }

  setModeloSelected(
    categoria: CategoriaModeloSelector,
    ind: number,
    modelo: ModeloProduto
  ) {
    if (categoria.modeloSelected === undefined) {
      categoria.modeloSelected = [];
    }

    let index = categoria.modeloSelected?.findIndex(
      (modeloSelect) => modeloSelect.index === ind
    );

    if (index != -1 && index != undefined) {
      categoria.modeloSelected![index ?? 0] = { index: ind, modelo: modelo };
    } else {
      categoria.modeloSelected?.push({ index: ind, modelo: modelo });
    }
  }

  getModeloInd(categoria: CategoriaModeloSelector, ind: number) {
    let modelo = categoria.modeloSelected?.find(
      (modeloSelect) => modeloSelect.index === ind
    );
    return modelo;
  }

  modeloActive(
    categoria: CategoriaModeloSelector,
    ind: number,
    modelo: ModeloProduto
  ) {
    let mod = categoria.modeloSelected?.find(
      (modeloSelect) => modeloSelect.index === ind
    );
    return { modelo_active: mod?.modelo?.modelName === modelo.modelName };
  }

  getModeloIsNotSelected(categoria: CategoriaModeloSelector, ind: number) {
    return categoria.rmodelsProduts?.filter((modelo) => {
      let notIquals = true;
      var modelos = categoria.modeloSelected?.filter(
        (modeloSelected) => modeloSelected.index != ind
      );

      modelos?.forEach((mod) => {
        if (mod.modelo?.modelName === modelo.modelName) {
          notIquals = false;
        }
      });

      return notIquals;
    });
  }

  getModeloFomatedName(modelos: ModeloProduto[]) {
    let name = '';
    modelos.forEach((modelo, index) => {
      name += `${index === 0 ? '' : ','}` + modelo.modelName;
    });

    return `(${name})`;
  }
}
