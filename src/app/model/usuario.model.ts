import { Endereco } from "./endereco.model"
import { Pedido } from "./pedido.model"

export class Usuario{
  id:number = 0
  contato: string = ""
  pedidos: Pedido[] = []
  enderecos: Endereco[] = []
}
