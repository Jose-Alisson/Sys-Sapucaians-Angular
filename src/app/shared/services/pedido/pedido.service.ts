import { UrlApiService } from './../UrlApi/url-api.service';
import { Pedido } from './../../../model/pedido.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignInService } from '../signIn/sign-in.service';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private URL_API_S = `${this.urlApi.URl_API}/pedido`;

  constructor(
    private http: HttpClient,
    private urlApi: UrlApiService,
    private signIn: SignInService
  ) {}

  selvar(pedido: Pedido) {
    return this.http.post<Pedido>(this.URL_API_S + '/save', pedido)
    //let params = new HttpParams().set('user', JSON.stringify(this.signIn.userFromPs)).set('pedido', JSON.stringify(pedido));
    /*params = params.append('user', JSON.stringify(this.signIn.userFromPs));
    params = params.append('pedido', JSON.stringify(pedido));*/

    /*return this.http.post<any>(this.URL_API_S + '/save', {}, {

    });*/
  }

  findAll() {
    return this.http.post<Pedido[]>(this.URL_API_S + '/findAll', {});
  }

  findByUsuarioId(){
    return this.http.post<Pedido[]>(this.URL_API_S + '/findAllByUsuarioId/' + this.signIn.userFromPs.id , {})
  }

  delete(id : number){
    return this.http.delete(this.URL_API_S + '/delete/' + id)
  }
}
