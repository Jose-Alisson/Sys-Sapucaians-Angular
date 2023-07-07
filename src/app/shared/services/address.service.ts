import { SignService } from 'src/app/shared/services/sign-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlApiService } from './url-api.service';
import { Injectable } from '@angular/core';
import { Endereco } from 'src/app/model/endereco.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient, private urlApi: UrlApiService, private sign: SignService) { }

  private URL_API = `${this.urlApi.springApiUrl}/address`

  save(userId: number, address: Endereco){
    let params = new HttpParams().set('usuario_id', userId)
    return this.http.post<Endereco>(this.URL_API + '/save', address, {params: params})
  }

  getAllByUserId(userId: number){
    let params = new HttpParams().set('usuario_id', userId)
    return this.http.get<Endereco>(this.URL_API, {params: params})
  }

  getAllByUserLogged(){
    return of(this.sign.auth.usuario?.enderecos)
  }
}
