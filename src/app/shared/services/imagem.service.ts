import { UrlApiService } from './url-api.service';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, async } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagemService {

  constructor(private http: HttpClient, private UApi: UrlApiService) {}

  urlApi = `${this.UApi.springApiUrl}/file`

  uploadImage(file: File | null){
    if(file){
      let form = new FormData();
      form.append('file', file, file.name)

      const headers = new HttpHeaders({
        'enctype': 'multipart/form-data',
        'Accept': 'application/json'
      });

      const options = { headers: headers };

      return this.http.post<any>(this.urlApi + '/upload', form, options)
      .pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error));
      }))
    }
    throw new Error("Arquivo Nulo")
  }

  downloadImagem(path: string): Observable<Blob> {
    const params = new HttpParams().set('filePath', path)
    return this.http.get(this.urlApi + '/download', { params: params, responseType: 'blob'});
  }

  private generateBoundary() {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}
