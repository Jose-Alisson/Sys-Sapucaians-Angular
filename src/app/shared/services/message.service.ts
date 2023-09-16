import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApiService } from './url-api.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient, private UApi: UrlApiService) { }

  private URL_API = `${this.UApi.springApiUrl}/message`

  enviar(to: string, message: string){

      let params = new HttpParams().set('to', to).set("message", message)

      return this.http.post<any>(this.URL_API + '/sendMessage', {}, {params: params})

  }
}
