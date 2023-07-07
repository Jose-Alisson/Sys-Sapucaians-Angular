import { AuthPsModel } from 'src/app/model/auth-ps.model';
import { UrlApiService } from './url-api.service';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from 'src/app/model/usuario.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  public usuario: Usuario | any;

  constructor(private http: HttpClient, private UApi: UrlApiService) {}

  private urlApi = `${this.UApi.springApiUrl}/user`;

  salvar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlApi + '/save', usuario);
  }
}
