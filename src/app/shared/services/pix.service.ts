import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApiService } from './url-api.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PixService {

  constructor(private http: HttpClient, private UApi: UrlApiService) { }

  private URL_API = `${this.UApi.springApiUrl}/pix`

  public gerarCobrancaPix(valor: string){
    if(valor){
        let params = new HttpParams().set('value', valor);
        return this.http.get<any>(this.URL_API + '/gerarCobrancaPix', { params: params})
    }

    return of();
  }

  gerarQrcode(cobrancaid: number){
    if(cobrancaid){
      let params = new HttpParams().set('id', cobrancaid);
      return this.http.get<any>(this.URL_API + '/gerarQrCodePix', { params: params})
    }
    return of();
  }
}
