import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { Pedido } from 'src/app/model/pedido.model';
import { PedidoService } from 'src/app/shared/services/pedido.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss'],
})
export class ViewOrderComponent {
  order?: Pedido;

  viewStateModal = false;
  newState: string = this.order?.state ?? '';

  constructor(
    private pedService: PedidoService,
    private toastr: ToastrService,
    private actRouter: ActivatedRoute,
    private router: Router
  ) {
    this.actRouter.queryParams.subscribe((params) => {
      pedService.findById(params['load_order']).subscribe({
        next: (data) => {
          this.order = data;
        },
      });
    });
  }

  getStateStyleOrder() {
    return {
      'in-progress': this.order?.state === 'Em Andamento',
      'in-prepration': this.order?.state === 'Em Preparação',
      'concluded-retirada': this.order?.state === 'Concluido Retirada',
      'concluded-delivery': this.order?.state === 'Concluido Delivery',
      'concluded-all': this.order?.state === 'Concluido Geral',
    };
  }

  getTroco() {
    let total = this.getValorTotal();

    this.order?.typesPay?.forEach((pay) => {
      total -= pay?.value ?? 0;
    });

    return +total;
  }

  getValorTotal() {
    let valortotal = 0;

    this.order?.qproducts?.forEach((qProd) => {
      valortotal += (qProd.product?.price ?? 0) * (qProd?.quantity ?? 0);
    });

    valortotal += this.order?.address?.price ?? 0;

    return valortotal;
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

  getAddressFormated(pedido: Pedido) {
    let nameAdress =
      pedido.address?.nameAddress != undefined
        ? pedido.address.nameAddress
        : '';
    let houseNumber =
      pedido.address?.houseNumber != undefined
        ? ', ' + pedido.address.houseNumber
        : '';
    let locality =
      pedido.address?.locality != undefined
        ? ', ' + pedido.address.locality
        : '';

    return `${nameAdress}${houseNumber}${locality}`;
  }

  alterOrderPropertys() {
    this.router.navigate(['dash-board', 'adm', 'order-list', 'shopping-box'], {
      queryParams: { load_order: this.order?.id },
    });
  }

  setViewState(state: string) {
    this.newState = state;
  }

  setStateInOrder() {
    if (this.order) {
      this.order!.state = this.newState;

      this.pedService.salvar(this.order!).then((d) => {
        d.subscribe({
          next: (ped) => {
            this.toastr.success(
              'Sucesso ao Alterar Estatus do Pedido',
              'Alterar Estatos'
            );
            //this.setPedidosState(ped.state ?? '');
          },
        });
      });
    }
  }

  spandViewStateModal(){
    this.newState = this.order?.state ?? ''
    this.viewStateModal = true
  }
}
