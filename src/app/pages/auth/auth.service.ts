import { User, UserResponse, Roles } from '@shared/models/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<Roles | null>(null);

  constructor( private http: HttpClient,
               private router: Router) {

    this.checkToken();

  }

  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isAdmin$(): Observable<string | null> {
    return this.role.asObservable();
  }

  login(authData: User): Observable<UserResponse | void> {

  return this.http.post<UserResponse>(
    `${environment.API_URL}/prod/api/v1/auth`,
    authData
    ).pipe(
      map( (res: UserResponse) => {
        this.saveLocalStorage(res);
        this.loggedIn.next(true);
        this.role.next(res.role);
        return res;
      }),
      catchError( (err) => this.handlerError(err))
    );

  }

  logout(): void {

    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.role.next(null);
    this.router.navigate(['/login'])

  }

  private checkToken(): void {

    const user = JSON.parse(localStorage.getItem('user') || "{}");

    if (user) {
      const isExpired = helper.isTokenExpired(user.token);

      if (isExpired) {
        this.logout();
      } else {
        this.loggedIn.next(true);
        this.role.next(user.role);
      }
    }

  }

  private saveLocalStorage(user: UserResponse): void {

    const { userId, message, ...rest } = user;
    localStorage.setItem('user', JSON.stringify(rest));

  }

  private handlerError(err: any): Observable<never> {

    let errorMessage: string = 'An error ocurred retrieving data';
    if (err) {
      errorMessage = `Error: code ${err.message}`;
    }
    return throwError(errorMessage);

  }

}
