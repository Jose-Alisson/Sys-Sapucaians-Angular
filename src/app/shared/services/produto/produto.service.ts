import { UrlApiService } from './../UrlApi/url-api.service';
import { environment } from './../../../../environments/environment';

import * as $ from 'jquery';

import { Produto } from './../../../model/Produto.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private URL_API_P = this.UrlApi.URl_API + '/produto';

  constructor(private UrlApi: UrlApiService, private http: HttpClient) {}

  getProductAll() {
    return this.http.post<Produto[]>(this.URL_API_P + '/findAll', {});
  }
}
