import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlApiService {



  private production = true

  springApiUrl =
  this.production === true ? "http://192.168.0.196:8081/api" : "http://localhost:8081/api"

  constructor() { }
}
