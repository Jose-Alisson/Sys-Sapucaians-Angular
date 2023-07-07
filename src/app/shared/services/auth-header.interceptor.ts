import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class AuthHeaderInteceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url === '/api/auth/save' ||
      req.url === '/api/auth/login' ||
      req.url === '/api/auth/isExist' ||
      req.url === '/api/auth/verifyCode'
    ) {
      return next.handle(req);
    }

    document.querySelectorAll('button').forEach(button => {
      if(button.getAttribute('interBlocked')){
        button.style.cursor = 'not-allowed'
        button.disabled = true
      }
    })

    if (localStorage.getItem('Token-Access')) {
      const authToken =
        'Bearer ' + JSON.parse(localStorage.getItem('Token-Access') ?? '');
      const authReq = req.clone({
        setHeaders: {
          /*'Content-Type': 'application/json',*/
          'Access-Control-Allow-Origin': '*', // ou a origem do seu servidor
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
          Authorization: `${authToken}`,
        },
        //headers: req.headers.set('Authorization', authToken),
      });
      return next.handle(authReq).pipe(finalize(() => {
        document.querySelectorAll('button').forEach(button => {
          button.style.cursor = 'default'
          button.disabled = false
        })
      }));
    }
    return next.handle(req).pipe(finalize(() => {
      document.querySelectorAll('button').forEach(button => {
        button.style.cursor = 'default'
        button.disabled = false
      })
    }));;
  }
}
