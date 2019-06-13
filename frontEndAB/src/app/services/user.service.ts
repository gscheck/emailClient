import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User, UserAccount } from '../models';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getRecord(payload: Number): Observable<UserAccount> {
        return this.http.get<UserAccount>(`/api/user/get/${payload}/account`, httpOptions).pipe(
          catchError(this.handleError)
        );
    }
    addRecord(payload: UserAccount): Observable<UserAccount> {
        return this.http.post<UserAccount>('/api/user/register', payload, httpOptions).pipe(
          catchError(this.handleError)
        );
    }
    updateRecord(payload: UserAccount): Observable<UserAccount> {
        //concatenates id with httpclient request
        return this.http.put<UserAccount>(`/api/user/put/${payload.uid}/account`, payload, httpOptions).pipe(
          catchError(this.handleError)
        );
    }
    private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! Something went wrong');
    }
}