import { Produto } from './../../../model/Produto.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private URL_API = "http://localhost:8081/produto"

  constructor(private http: HttpClient) {}

  getProductAll(){
    return this.http.get<Produto[]>(this.URL_API + '/findAll')
  }
}
