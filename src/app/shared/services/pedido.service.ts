import { Pedido } from 'src/app/model/pedido.model';
import { UrlApiService } from './url-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient, private UApi: UrlApiService) { }

  private URL_API = `${this.UApi.springApiUrl}/pedido`

  async salvar(pedido: Pedido): Promise<Observable<Pedido>>{
    return this.http.post<Pedido>(this.URL_API + '/save', pedido, {})
  }

  delete(id: number){
    return this.http.delete(this.URL_API + `/delete/${id}`);
  }

  findAllByUserId(id: number | null | undefined){
    if(id){
      let params = new HttpParams().set('usuario_id', id)
      return this.http.get<Pedido[]>(this.URL_API + '/findAllByUser', {params: params})
    }
    return of()
  }

  findById(id: number){
    let params = new HttpParams().set('id', id)
    return this.http.get<Pedido>(this.URL_API + '/findById', { params })
  }

  findDistictMonthByYear(year: number){
    let params = new HttpParams().set('year', year)
    return this.http.get<number[]>(this.URL_API + '/findDistictMonthByYear', {params: params})
  }


  findDistictDayByDate(year: number, month: number){
    let params = new HttpParams().set('year', year).set('month', month)
    return this.http.get<number[]>(this.URL_API + '/findDistictDayByDate', {params: params})
  }


  async findAllByDate(date: string): Promise<Observable<Pedido[]>> {
    let params = new HttpParams().set('date', date)
    return this.http.get<Pedido[]>(this.URL_API + '/findAllByDate', {params: params})
  }

  findAll(){
    return this.http.get<Pedido[]>(this.URL_API + '/findAll')
  }
}
