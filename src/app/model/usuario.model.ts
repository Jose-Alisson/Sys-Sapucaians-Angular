import { Endereco } from "./endereco.model"
import { Pedido } from "./pedido.model"

export declare class Usuario{
  id:Number
  email: string
  provedorr: string
  contato: string
  enderecos: Endereco[]
  pedidos: Pedido[]
}
