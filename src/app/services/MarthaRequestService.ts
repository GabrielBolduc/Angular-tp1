import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, catchError, tap} from 'rxjs/operators';
import {InsertResult} from '../models/insert-result';

@Injectable({
  providedIn: 'root'
})
export class MarthaRequestService {
  private readonly username = 'gabriel';
  private readonly password = 'pU500EsNf6*3qv';

  constructor(private http: HttpClient) { }

  private get headers() {
    return { headers: {'auth' : btoa(`${this.username}:${this.password}`)}};
  }

  private getUrl(query: string) {
    return `http://martha.jh.shawinigan.info/queries/${query}/execute`;
  }

  select(query: string, body: any = null): Observable<any | null> {
    return this.http.post<any>(this.getUrl(query), body, this.headers).pipe(
      map(response => {
        console.log('Martha select', response);

        if (response.success) {
          return response.data;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.log('Error', error);

        return of(null);
      })
    );
  }

  insert(query: string, body: any = null): Observable<InsertResult | null> {
    return this.http.post<any>(this.getUrl(query), body, this.headers).pipe(
      map(result => {
        console.log('Martha insert', result);

        return new InsertResult(result);
      }),
      catchError(error => {
        console.log('Error', error);

        return of(null);
      })
    );
  }

  statement(query: string, body: any = null): Observable<boolean | null> {
    return this.http.post<any>(this.getUrl(query), body, this.headers).pipe(
      tap(response => console.log('Martha statement', response)),
      map(result => result.success ?? false),
      catchError(error => {
        console.log('Error', error);

        return of(null);
      })
    );
  }
}