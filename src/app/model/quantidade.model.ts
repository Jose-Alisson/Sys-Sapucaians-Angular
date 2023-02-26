import { Produto } from 'src/app/model/Produto.model';
export class QuantidadeProduto{

  id!:number
  produto!:Produto | undefined
  quantidade!:number
}
