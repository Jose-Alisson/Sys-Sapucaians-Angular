import { UsuarioService } from './usuario.service';
import { UrlApiService } from './url-api.service';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, catchError, throwError, retry, BehaviorSubject } from 'rxjs';
import { Usuario } from 'src/app/model/usuario.model';
import { AuthPsModel } from 'src/app/model/auth-ps.model';

@Injectable({
  providedIn: 'root',
})
export class SignService {

   isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  public auth: AuthPsModel = {};

  constructor(private http: HttpClient, private uApi: UrlApiService) {}

  urlApi = `${this.uApi.springApiUrl}/auth`;

  login(auth: AuthPsModel) {
    return this.http.post<AuthPsModel>(this.urlApi + '/login', auth).pipe(
      tap((data: any) => {
        let token = data?.['tokenAccess'];
        this.auth = data?.['auth']

        localStorage.removeItem('Token-Access');
        localStorage.setItem('Token-Access', JSON.stringify(token));

        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  salvar(user: AuthPsModel) {
    return this.http.post<{ tokenAccess: string; auth: string }>(
      this.urlApi + '/save',
      user
    );
  }

  sendCodeNumber(phoneNumber: string, provider: string) {
    let params = new HttpParams()
      .set('number', phoneNumber)
      .set('provider', provider);

    return this.http.get<{ token: '' }>(this.urlApi + '/verifyCode', {
      params,
    });
  }

  verifyCodeNumber(code: string, token: string) {
    let params = new HttpParams().set('code', code);
    let headers = new HttpHeaders().set('codeToken', token);

    return this.http.post<any>(
      this.urlApi + '/verifyCode',
      {},
      { headers, params }
    );
  }

  findById(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http
      .get<AuthPsModel>(this.urlApi + '/findById', { params })
      .pipe(
        tap((data) => {
          this.auth = data;
        })
      );
  }

  findByEmail(email: string) {
    let params = new HttpParams().set('email', email);
    return this.http
      .get<AuthPsModel>(this.urlApi + '/findByEmail', { params })
      .pipe(
        tap((data) => {
          this.auth = data;
        })
      );
  }

  isExist(email: string) {
    let params = new HttpParams().set('email', email);
    return this.http
      .get<any>(this.urlApi + '/isExist', { params })
      .pipe(map((number_) => number_ !== 0));
  }
}
