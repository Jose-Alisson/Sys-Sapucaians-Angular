import { Produto } from './../../../model/Produto.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private URL_API = "https://75db-45-6-136-56.sa.ngrok.io/produto"

  constructor(private http: HttpClient) {}

  getProductAll(){
    return this.http.post<Produto[]>(this.URL_API + '/findAll', {})
  }
}
