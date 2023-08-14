import { PedidoService } from '../../services/pedido.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Produto } from 'src/app/model/Produto.model';
import { Endereco } from 'src/app/model/endereco.model';
import { Pedido } from 'src/app/model/pedido.model';

import { DomSanitizer } from '@angular/platform-browser';
import { QuantidadeProduto } from 'src/app/model/quantidade.model';
import { exValoresDaTaxa } from 'src/app/pages/about/about.component';
import { ImagemService } from '../../services/imagem.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {

  @Input()
  title!: string;

  @Input()
  fadeExpandComp!: boolean;

  @Output()
  fadeEvent: EventEmitter<boolean> = new EventEmitter()

  @Output()
  closeModalEvent: EventEmitter<void> = new EventEmitter()

  ngOnInit(): void {
  }

  closeModal(){
    this.closeModalEvent.emit()
    if(this.fadeExpandComp){
      this.fadeExpandComp = false
    } else {
      this.fadeEvent.emit(false)
    }
  }
}
