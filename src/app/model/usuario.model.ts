import { SafeUrl } from '@angular/platform-browser';
import { Endereco } from "./endereco.model";
import { Pedido } from "./pedido.model";

export declare class Usuario {
  id?:number | null
  photoUrl?: string | null
  contact?: string | null
  name?: string | null
  lastName?:string | null
  addresses?: Endereco[] | null
  orders?: Pedido[] | null
}
