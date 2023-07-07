import { DomSanitizer } from '@angular/platform-browser';
import { ImagemService } from './imagem.service';
import { Produto } from 'src/app/model/Produto.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UrlApiService } from './url-api.service';
import { Injectable, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {

  constructor(
    private http: HttpClient,
    private UApi: UrlApiService,
    private imgService: ImagemService,
    private sanitizer: DomSanitizer
  ) {
  }

  private URL_API = `${this.UApi.springApiUrl}/produto`;

  salvar(produto: Produto) {
    return this.http.post<Produto>(this.URL_API + '/save', produto);
  }

  getAllProduct() {
    return this.http.get<Produto[]>(this.URL_API + '/findAll');
  }

  removeProduct(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.delete<any>(this.URL_API + `/delete`, { params: params });
  }

  findById(id: number){
    let params = new HttpParams().set('id', id);
    return this.http.get<Produto>(this.URL_API + '/find', {params: params})
  }
}
