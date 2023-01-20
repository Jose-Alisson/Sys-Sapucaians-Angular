import { Endereco } from './endereco.model';
import { Produto } from "./Produto.model"

export class Pedido{
  id:number = 0
  numeroDoPedido:number = 0
  produtos:Produto[] = []
  descricao:string = ""
  endereco:Endereco = {
    id: 0,
    nomeDoEndereco: '',
    cep: '',
    numeroDaCasa: '',
    localidade: ''
  }
  tipoDePagamento:string = ""
  troco:string = ""
}
