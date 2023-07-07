import { Produto } from 'src/app/model/Produto.model';
import { ModeloProduto } from './modelProduct';
import { CategoriaModeloSelector } from './CategoriaModeloSelector';
export declare class QuantidadeProduto{

  id?:number | null
  product?: Produto | null
  rmodelsProduts?: ModeloProduto[] | null
  quantity?: number | null
}
