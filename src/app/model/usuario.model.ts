import { Endereco } from "./endereco.model"
import { Pedido } from "./pedido.model"

export class Usuario{
  id:number = 0
  foto: string = ""
  nome: string = ""
  email: string = ""
  senha: string = ""
  contato: string = ""
  pedidos: Pedido[] = []
  enderecos: Endereco[] = []
}
