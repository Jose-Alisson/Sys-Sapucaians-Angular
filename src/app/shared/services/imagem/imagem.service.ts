import { UrlApiService } from './../UrlApi/url-api.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagemService {

  constructor(private http: HttpClient, private urlApi: UrlApiService) {}

  downloadImagem(id: number): Observable<Blob> {
    const url = `${this.urlApi.URl_API}/produto/imagem/${id}`;
    return this.http.post(url, {},{ responseType: 'blob'});
  }
}
