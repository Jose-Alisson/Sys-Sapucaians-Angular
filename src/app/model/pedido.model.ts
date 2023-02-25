import { QuantidadeProduto } from './quantidade.model';
import { Endereco } from './endereco.model';
import { Produto } from "./Produto.model"

export class Pedido{

  id!:number
  numeroDoPedido!:number
  produtos!:QuantidadeProduto[]
  descricao!:string
  endereco!:Endereco | undefined
  tipoDePagamento!:string
  troco!:string
}
