import { Endereco } from "./endereco.model"
import { Pedido } from "./pedido.model"

export class Usuario{
  id:number = 0
  email: string = ""
  provedorr: string = ""
  contato: string = ""
  enderecos: Endereco[] = []
}
