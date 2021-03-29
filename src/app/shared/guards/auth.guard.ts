import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.store.select('auth').pipe(
        take(1),
        map(authState => {
        if(state.url === '/user/booking'){
          return !!authState.bookingParams ? true : this.router.createUrlTree(['/']);
        } else if (state.url.startsWith('/user/')){
          return !!authState.user.token ? true : this.router.createUrlTree(['login']);
        } else if (state.url.startsWith('/admin/')){
          return !!authState.user.token && authState.user.role === 'Admin' ? true : this.router.createUrlTree(['login']);
        }
        return true;
      }));
  }
}
