import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlApiService {



  private production = false

  springApiUrl =
  this.production === true ? "https://pizzaria-sapucaians-spring-production.up.railway.app/api" : "http://192.168.196:8081/api"

  constructor() { }
}
