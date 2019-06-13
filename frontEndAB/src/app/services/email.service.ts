import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Models for data
import { SendEmail, RecievedEmail } from '../models';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class EmailService {
    constructor(private http: HttpClient) { }
    
    getRecords(payload: Number): Observable<RecievedEmail[]> {
        //filter for emails in inbox or sent will be a future feature
        return this.http.get<RecievedEmail[]>(`/api/user/get/${payload}/messages`, httpOptions).pipe(
          catchError(this.handleError)
        );
    }

    getRecord(uid: Number, message_id: Number): Observable<any> {
        return this.http.get<any>(`/api/user/get/${uid}/message/${message_id}`, httpOptions).pipe(
          catchError(this.handleError)
        );
    }
  
    addRecord(payload: SendEmail): Observable<SendEmail> {
        return this.http.post<SendEmail>('/api/user/post/message', payload, httpOptions).pipe(
          catchError(this.handleError)
        );
    }

    // Tells us when api related error occurs
    private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! Something went wrong');
    }
}