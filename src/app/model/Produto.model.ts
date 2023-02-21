import { SafeUrl } from "@angular/platform-browser";

export class Produto{

  urlImagem!: SafeUrl;
  id:number = 0
  foto:string = ""
  nomeDoProduto: string = ""
  descricao: string = ""
  preco: number = 0
  categoria:string = ""
  quantidade:number = 0
  emEstoque:number = 0
}
