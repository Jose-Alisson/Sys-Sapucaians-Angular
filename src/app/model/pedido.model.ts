import { Usuario } from 'src/app/model/usuario.model';
import { QuantidadeProduto } from './quantidade.model';
import { Endereco } from './endereco.model';
import { Produto } from './Produto.model';
import { TypePay } from './typePay';
import { OrderState } from './OrderState';

export declare class Pedido {
  id?: number | null;
  qproducts?: QuantidadeProduto[] | null;
  creationDate?: string | null;
  description?: string | null;
  address?: Endereco | null;
  typesPay?: TypePay[] | null;
  user?: Usuario | null;
  state?: string | null; /*OrderState[] | null*/
}
