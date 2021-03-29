import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { User } from '../../models/app-models/user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.L0GIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<User>(
          environment.BASE_URL + 'api/auth/login',
          {
            email: authData.payload.email,
            password: authData.payload.password
          }
        )
        .pipe(
          map(user => {
            user.tokenExpirationDate = Date.now() + 7776000000;
            authData.payload.rememberMe
            ? window.localStorage.setItem('user', JSON.stringify(user))
            : window.sessionStorage.setItem('user', JSON.stringify(user));
            return new AuthActions.Authenticate(user)
          }),
          catchError((errorRes) => {
            let errorMessage = 'An error occured. Please try again later.';
            if (errorRes && errorRes.error){
              errorMessage = errorRes.error.message;
            }
            return of(new AuthActions.AuthenticateFail(errorMessage));
          })
        );
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      let user: User =  JSON.parse(window.localStorage.getItem('user'));
      if (!user){
        return { type : 'DUMMY_TYPE'}
      }
      return new AuthActions.Authenticate(user);
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE),
    tap(() => this.router.navigate(['/']))
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      window.localStorage.removeItem('user');
    })
  );
}
