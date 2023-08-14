import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injectable,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/model/pedido.model';
import { RadioListComponent } from 'src/app/shared/comps/radio-list/radio-list.component';
import { ImagemService } from 'src/app/shared/services/imagem.service';
import { PedidoService } from 'src/app/shared/services/pedido.service';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit, AfterViewInit, OnDestroy {
  pedidoSelected?: Pedido;

  currentDate: Date = new Date();
  newDate: Date = new Date();

  allDistictMonth: number[] = [];
  allDistictDay: number[] = [];

  allPedidos: Pedido[] = [];
  allPedidosState: Pedido[] = [];

  viewStateModal = false;

  newState = '';

  viewOrderInModal = false;
  viewDateModal = false;

  loopRequest: any;

  currentState = '';

  viewOrdersList = true

  @ViewChild('viewGeral', {static: true})
  radioListElement!: RadioListComponent

  @ViewChild('orderContainer', { static: true })
  orderContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('containerLeft', { static: true })
  containerLeft!: ElementRef<HTMLDivElement>;

  @ViewChild('btnVContainerLeft', { static: true })
  btnVContainerLeft!: ElementRef<HTMLLIElement>;


  dateTableMonth = [
    { month: 'Jan', MonthIndex: 1 },
    { month: 'Fev', MonthIndex: 2 },
    { month: 'Mar', MonthIndex: 3 },
    { month: 'Abr', MonthIndex: 4 },
    { month: 'Mai', MonthIndex: 5 },
    { month: 'Jun', MonthIndex: 6 },
    { month: 'Jul', MonthIndex: 7 },
    { month: 'Ago', MonthIndex: 8 },
    { month: 'Set', MonthIndex: 9 },
    { month: 'Out', MonthIndex: 10 },
    { month: 'Nov', MonthIndex: 11 },
    { month: 'Dez', MonthIndex: 12 },
  ];

  constructor(
    private pedService: PedidoService,
    private imgService: ImagemService,
    private saninizer: DomSanitizer,
    private router: Router,
    private toastr: ToastrService,
    private print: PrintService,
    private alterPedService: alterPedidoService
  ) {}
  ngOnDestroy(): void {
    clearInterval(this.loopRequest);
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.pedService
      .findDistictMonthByYear(this.currentDate.getFullYear())
      .subscribe((data: number[]) => {
        this.allDistictMonth = data;
        this.setMonth(this.currentDate.getMonth() + 1);
        this.setDistinctDay();

        this.findAllByDate();
      });

    this.loopRequest = setInterval(() => {
      this.findAllByDate();
    }, 1000 * 5);

    this.alterPedService.event.subscribe({next: (ped: Pedido) => {
      let index = this.allPedidosState.findIndex(p => p.id === ped.id)

      if(index != -1){
        this.allPedidosState[index] = ped
      } else {
        this.allPedidosState.push(ped)
      }
    }})

    this.alterPedService.eventdlt.subscribe({
      next: (id : number) => {
        this.allPedidosState = this.allPedidosState.filter(ped => ped.id !== id)
      }
    })
  }

  setMonth(month: number) {
    this.currentDate.setMonth(month);
  }

  setDay(day: number) {
    this.currentDate.setDate(day);
  }

  setMonthNewDate(month: number) {
    this.newDate.setMonth(month);
  }

  setDayNewDate(day: number) {
    this.newDate.setDate(day);
  }

  isMonthSelected(month: number) {
    return this.currentDate.getMonth() === month;
  }

  isDaySelected(day: number) {
    return this.currentDate.getDate() === day;
  }

  findNameMonth(index: number) {
    return this.dateTableMonth.find(({ MonthIndex }) => MonthIndex === index)
      ?.month;
  }

  setDistinctDay() {
    this.pedService
      .findDistictDayByDate(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth()
      )
      .subscribe((data) => {
        this.allDistictDay = data;
        console.log(data);
      });
  }

  findAllByDate() {
    const dia = String(this.currentDate.getDate()).padStart(2, '0'); // Obtém o dia com dois dígitos
    const mes = String(this.currentDate.getMonth()).padStart(2, '0'); // Obtém o mês com dois dígitos (lembre-se que o mês é baseado em zero)
    const ano = this.currentDate.getFullYear(); // Obtém o ano com quatro dígitos

    this.pedService.findAllByDate(`${ano}-${mes}-${dia}`).then((d) => {
      d.subscribe((data) => {
        this.allPedidos = data;

        this.setPedidosState(this.currentState);
      });
    });
  }

  toggleDisplayWrapper(element: HTMLElement) {
    element.toggleAttribute('active');
  }

  isWrapperActive(element: HTMLElement) {
    return element.getAttribute('active') != null;
  }

  getStateInOrder(pedido: Pedido) {
    return pedido.state;
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

  setPedidoSelected(pedido: Pedido) {
    this.pedidoSelected = pedido;

    this.pedidoSelected.qproducts?.forEach((qProd) => {
      if (qProd.product) {

        qProd.product?.photoUrl?.forEach(photo => {
          this.imgService
          .downloadImagem(photo)
          .subscribe((blob) => {
            qProd.product?.photoObject?.push(this.saninizer.bypassSecurityTrustUrl(
              URL.createObjectURL(blob)
            ));
          });
        })
      }
    });
  }

  getValorTotal() {
    let valortotal = 0;

    this.pedidoSelected?.qproducts?.forEach((qProd) => {
      valortotal += (qProd.product?.price ?? 0) * (qProd?.quantity ?? 0);
    });

    valortotal += this.pedidoSelected?.address?.price ?? 0;

    return valortotal;
  }

  getTroco() {
    let total = this.getValorTotal();

    this.pedidoSelected?.typesPay?.forEach((pay) => {
      total -= pay?.value ?? 0;
    });

    return +total;
  }

  setPedidosState(state: string) {
    this.currentState = state
    this.allPedidosState = []

    let value =  this.radioListElement.values.find(radio => radio['name'] === 'view Geral')
    let ordem = ['Em Andamento', 'Em Preparação', 'Concluido Retirada', 'Concluido Delivery',  value?.value === true ? 'Concluido Geral' : '', '']
    let newOrdem: string[] = []

    ordem.forEach((s) =>{
      if(!(newOrdem.findIndex(o => o === s) != -1)){
        newOrdem.push(s)
      }
    })

    newOrdem.forEach(s => {
      this.allPedidosState = [...this.allPedidosState, ...this.allPedidos.filter((ped) => ped.state === s)]
    })

    //this.allPedidosState = ;
  }

  openModalState() {
    this.newState = this.pedidoSelected?.state ?? '';
    this.viewStateModal = true;
  }

  alterOrderPropertys() {
    this.router.navigate(['dash-board', 'adm', 'shopping-box'], {
      queryParams: { load_order: this.pedidoSelected?.id },
    });
  }

  setViewState(state: string) {
    this.newState = state;
  }

  setPedidosAll() {
    this.allPedidosState = this.allPedidos;
  }

  setCurrentDate(){

    this.currentDate = new Date(this.newDate.toUTCString())
    //this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    this.newDate = new Date()
  }

  setStateInOrder() {
    this.pedidoSelected!.state = this.newState;

    this.pedService.salvar(this.pedidoSelected!).then((d) => {
      d.subscribe({
        next: (ped) => {
          this.toastr.success(
            'Sucesso ao Alterar Estatus do Pedido',
            'Alterar Estatos'
          );
          //this.setPedidosState(ped.state ?? '');
          let index = this.allPedidosState.findIndex((p) => p.id === ped.id)
          if(index != -1){
            this.allPedidosState[index] = ped
          } else {
            this.allPedidosState.push(ped)
          }
        },
      });
    });
  }

  printPedido() {
    this.print.printarPedido(this.pedidoSelected?.id ?? 0).subscribe({
      next: () => {
        this.toastr.success('Imprimido Pedido', 'Impressao');
      },
      error: () => {
        this.toastr.error('Erro ao tentar imprimido pedido', 'Impressao');
      },
    });
  }

   order_id = 0

  setViewOrder(id: number){
    this.order_id = id
    this.router.navigate([], {queryParams: {'load_order': id}})
  }

  getLoadOrder(){
    if(this.order_id != 0){
      return {'load_order': this.order_id}
    }

    return {}
  }

  getCurrentMonth() {
    return new String(this.currentDate.getMonth()).padStart(2, '0');
  }

  getCurrentDay() {
    return new String(this.currentDate.getDate()).padStart(2, '0');
  }

  getNewMonth() {
    return new String(this.currentDate.getMonth()).padStart(2, '0');
  }

  getNewtDay() {
    return new String(this.currentDate.getDate()).padStart(2, '0');
  }

  @HostListener('document:click', ['$event'])
  fecharDropdown(event: MouseEvent) {

  }
}

@Injectable({
  providedIn : 'root'
})
export class alterPedidoService{
  event: EventEmitter<Pedido> = new EventEmitter<Pedido>()
  eventdlt : EventEmitter<number> = new EventEmitter<number>()
}
