import { UrlApiService } from './../UrlApi/url-api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private URL_API_S = this.urlApi.URl_API + '/user'

  constructor(private urlApi:UrlApiService ) { }
}
