import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserInfo } from '../models/app-models/user-info';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  urlEndpoint = environment.BASE_URL;

  constructor(private http: HttpClient) {}

   resendVerification(email: string, password: string): any {
    return this.http
      .post(
        this.urlEndpoint + 'api/auth/email/resend',
        {
          email: email,
          password: password,
        },
        {
          observe: 'response',
        }
      )
      .pipe(
        map((response) => response.body),
        catchError((errorRes) => throwError(this.getErrorMessage(errorRes)))
      );
  }

  register(userInfo: UserInfo): Observable<any> {
    return this.http
      .post<any>(this.urlEndpoint + 'api/auth/register', userInfo, {
        observe: 'response',
        responseType: 'json',
      })
      .pipe(
        map((response) => response.body),
        catchError((errorRes) => throwError(this.getErrorMessage(errorRes)))
      );
  }

  getForgattenPasswordCode(email: string) {
    return this.http
      .post<any>(
        this.urlEndpoint + 'api/auth/password/forgot',
        { email: email },
        { observe: 'response', responseType: 'json' }
      )
      .pipe(
        map((response) => response.body),
        catchError((errorRes) => throwError(this.getErrorMessage(errorRes)))
      );
  }

  getAdminAllUsers() {
    const params = new HttpParams().append('count', '0');
    return this.http.get<any>(this.urlEndpoint + 'api/admin/users', {params}).pipe(
      catchError((errorRes) => throwError(this.getErrorMessage(errorRes)))
    );
  }

  paginateAdminAllUsers(url: string, index: number) {
    const params = new HttpParams().append('count', index.toString());
    return this.http.get<any>(url, {params}).pipe(
      catchError((errorRes) => throwError(this.getErrorMessage(errorRes)))
    );
  }

  getAdminAllBookings() {
    const params = new HttpParams().append('count', '0');
    return this.http
      .get<any>(this.urlEndpoint + 'api/admin/get-all-bookings', {params})
      .pipe(catchError((errorRes) => throwError(this.getErrorMessage(errorRes))));
  }

  paginateAdminAllBookings(url: string, index: number) {
    const params = new HttpParams().append('count', index.toString());
    return this.http
      .get<any>(this.urlEndpoint + 'api/admin/get-all-bookings', {params})
      .pipe(catchError((errorRes) => throwError(this.getErrorMessage(errorRes))));
  }

  getUsersAllBookings(): Observable<any> {
    return this.http
      .get<any>(this.urlEndpoint + 'api/user/get-all-bookings')
      .pipe(
        map((response) => {console.log(response); return response.data.item.bookings}),
        catchError((errorRes) => throwError(this.getErrorMessage(errorRes)))
      );
  }

  getUsersBooking(email: string, bookingId: number) {
    return this.http
      .get<any>(
        this.urlEndpoint + 'api/user/get-user-booking/' + email + '/' + bookingId
      )
      .pipe(
        map((response) => response.data),
        catchError((errorRes) => throwError(this.getErrorMessage(errorRes)))
      );
  }

  blogRequest(formData): Observable<any> {
    return this.http
      .post(this.urlEndpoint + 'api/admin/add-blog', formData)
      .pipe(catchError((errorRes) => throwError(this.getErrorMessage(errorRes))));
  }

  deleteBlog(id: any) {
    return this.http
      .delete(this.urlEndpoint + 'api/admin/blog/' + id + '/delete')
      .pipe(catchError((errorRes) => throwError(this.getErrorMessage(errorRes))));
  }

  addFaq(data: { title: string; body: { tag: string; element: string; }[]; }) {
    return this.http
      .post(this.urlEndpoint + 'api/admin/add-faq', data)
      .pipe(catchError((errorRes) => throwError(this.getErrorMessage(errorRes))));
  }

  private getErrorMessage(errorRes): string {
    console.log(errorRes);
    let errorMessage = 'An error occured. Please try again later.';
    if (!errorRes || !errorRes.error) return errorMessage;
    return errorRes.error.message;
  }
}
