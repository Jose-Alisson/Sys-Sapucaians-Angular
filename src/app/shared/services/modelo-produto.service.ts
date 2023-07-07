import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlApiService } from './url-api.service';
import { Injectable } from '@angular/core';
import { ModeloProduto } from 'src/app/model/modelProduct';

@Injectable({
  providedIn: 'root'
})
export class ModeloProdutoService {

  constructor(private url: UrlApiService, private http: HttpClient) { }

  private URL_API = `${this.url.springApiUrl}/modelo/produto`

  findById(id: number){
    let params = new HttpParams().set('id', id)
    return this.http.get<ModeloProduto>(this.URL_API + '/findById', {params: params})
  }
}
