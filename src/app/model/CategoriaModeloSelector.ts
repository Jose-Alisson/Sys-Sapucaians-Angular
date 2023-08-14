import { ModeloProduto } from './modelProduct';

export class CategoriaModeloSelector {
  id?: number | null;
  rmodelsProduts?: ModeloProduto[] | null;
  category?: string | null;
  numberSelections?: number | null;
  modeloSelected?: { index?: number | null; modelo?: ModeloProduto | null;}[] = [];
}
