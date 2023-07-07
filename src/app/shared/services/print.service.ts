import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApiService } from './url-api.service';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor(private http: HttpClient, private UApi: UrlApiService) {}

  private URL_API = `${this.UApi.springApiUrl}/print`;

  printarPedido(id: number){
    let params = new HttpParams().set('pedido_id', id)

    return this.http.post<any>(this.URL_API + '/pedido', {}, {params: params})
  }
}
