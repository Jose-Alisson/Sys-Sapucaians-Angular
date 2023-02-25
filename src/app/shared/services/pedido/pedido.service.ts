import { UrlApiService } from './../UrlApi/url-api.service';
import { Pedido } from './../../../model/pedido.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private URL_API_S = `${this.urlApi.URl_API}/pedido`

  constructor(private http: HttpClient, private urlApi: UrlApiService) { }

  selvar(pedido: Pedido){

    return this.http.post<Pedido>(this.URL_API_S + '/save', pedido)
  }

  findAll(){
    return this.http.post<Pedido[]>(this.URL_API_S + '/findAll', {})
  }
}
