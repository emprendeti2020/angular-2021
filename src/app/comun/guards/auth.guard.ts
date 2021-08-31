import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
 
 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {


  constructor( private authService: AuthService,
    private router: Router ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
 
        return this.authService.validarToken()
                .pipe (
                  tap( valid => {
                      if ( !valid ){
                        this.router.navigate(['./login']);
                      }
                  } )
                );
      }

      canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean> | boolean {
    
        return this.authService.validarToken()
                .pipe (
                  tap( valid => {
                      if ( !valid ){
                        this.router.navigate(['./login']);
                      }
                  } )
                );
 
      }
}
