import { SafeUrl } from "@angular/platform-browser";
import { ModeloProduto } from "./modelProduct";
import { CategoriaModeloSelector } from "./CategoriaModeloSelector";

export declare class Produto{
  photoObject?: SafeUrl[] | null
  idProduct?: number | null
  photoUrl?:string[] | null
  nameProduct?: string | null
  description?: string | null
  price?: number | null
  category?:string | null
  inStock?:number | null
  categoriaSelectors?: CategoriaModeloSelector[] | null
}
