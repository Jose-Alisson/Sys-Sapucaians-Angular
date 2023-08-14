import { SignService } from './../../shared/services/sign-service.service';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/model/pedido.model';
import { QuantidadeProduto } from 'src/app/model/quantidade.model';
import { ImagemService } from 'src/app/shared/services/imagem.service';
import { PedidoService } from 'src/app/shared/services/pedido.service';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-cart-queue',
  templateUrl: './cart-queue.component.html',
  styleUrls: ['./cart-queue.component.scss'],
})
export class CartQueueComponent {
  allPedidos: Pedido[] = [];

  constructor(
    private router: Router,
    private pedService: PedidoService,
    private imgService: ImagemService,
    private sanitizer: DomSanitizer,
    private print: PrintService,
    private toastr: ToastrService,
    private sign: SignService
  ) {}

  ngOnInit(): void {
    this.pedService
      .findAllByUserId(this.sign.auth.user?.id)
      .subscribe((data) => {
        data.forEach((pedido) => {
          pedido.qproducts?.forEach((prod) => {
            prod.product?.photoUrl?.forEach((photo) => {
              this.imgService.downloadImagem(photo).subscribe({
                next: (blob) => {
                  if (prod.product) {
                    prod.product.photoObject?.push(
                      this.sanitizer.bypassSecurityTrustUrl(
                        URL.createObjectURL(blob)
                      )
                    );
                  }
                },
                error: () => {},
              });
            });
          });
        });

        this.allPedidos = data;
      });
  }

  getSubTotal(cart: QuantidadeProduto[] | null | undefined) {
    let value = 0;
    if (cart) {
      cart.forEach((prod) => {
        value += (prod.product?.price ?? 0) * (prod.quantity ?? 0);
      });
    }
    return value;
  }

  getStateStyleOrder(pedido: Pedido) {
    return {
      'in-progress': pedido.state === 'Em Andamento',
      'in-prepration': pedido.state === 'Em Preparação',
      'concluded-retirada': pedido.state === 'Concluido Retirada',
      'concluded-delivery': pedido.state === 'Concluido Delivery',
      'concluded-all': pedido.state === 'Concluido Geral',
    };
  }

  getOrderTotal(pedido: Pedido) {
    let total = 0;
    pedido.qproducts?.forEach(
      (qProd) => (total += (qProd.product?.price ?? 0) * (qProd.quantity ?? 0))
    );
    total != (pedido.address?.price ?? 0);

    return total;
  }

  getFomatedDate(pedido: Pedido) {
    let date = new Date(pedido.creationDate ?? '0000-00-00T00:00:00.0');
    return `${new String(date.getDate()).padStart(2, '0')}/${new String(
      date.getMonth() + 1
    ).padStart(2, '0')}/${date.getFullYear()} às ${new String(
      date.getHours()
    ).padStart(2, '0')}:${new String(date.getMinutes()).padStart(
      2,
      '0'
    )}:${new String(date.getSeconds()).padStart(2, '0')}`;
  }

  viewOrder(id: number) {
    this.router.navigate(['checkout'], { queryParams: { pedido_id: id } });
  }

  dltPedido(id: number) {
    let index = this.allPedidos.findIndex(p => p.id === id)

    this.allPedidos[index].user = undefined

    this.pedService.salvar(this.allPedidos[index]).then(r => r.subscribe())

    this.pedService.delete(id).subscribe({
      next: () => {
        this.allPedidos = this.allPedidos.filter((ped) => ped.id != id);
      },
    });
  }

  private compararData(dataA: Date, dataB: Date) {
    return  dataB.getTime() - dataA.getTime();
  }

  getAllPedidos() {
    return this.allPedidos.sort((a, b) =>
      this.compararData(
        new Date(a.creationDate ?? ''),
        new Date(b.creationDate ?? '')
      )
    );
  }
}
