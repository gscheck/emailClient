import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Contact } from '../models';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class ContactService {
    constructor(private http: HttpClient) { }

    getRecord(uid: number, email: string): Observable<Contact> {
      console.log('get record');
        return this.http.get<Contact>(`/api/contact/${uid}/get/${email}`, httpOptions).pipe(
          catchError(this.handleError)
        );
    }

    getRecords(payload: Number): Observable<Contact[]> {
      return this.http.get<Contact[]>(`/api/contacts/get/${payload}`, httpOptions).pipe(
        catchError(this.handleError)
      );
    }
    
    addRecord(payload: Contact): Observable<Contact> {
        return this.http.post<Contact>('/api/post/contact', payload, httpOptions).pipe(
          catchError(this.handleError)
        );
    }

    deleteRecord(uid: number, email: string) {
      return this.http.delete<Contact[]>(`/api/contact/${uid}/delete/${email}`, httpOptions).pipe(
        catchError(this.handleError)
      );
    }

    updateRecord(payload: Contact, uid: number, email_addr: string): Observable<Contact> {
        //concatenates id with httpclient request
        return this.http.put<Contact>(`/api/contact/${uid}/put/${email_addr}`, payload, httpOptions).pipe(
          catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! Something went wrong');
    }
}