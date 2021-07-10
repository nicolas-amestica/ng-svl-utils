import { User, UserResponse } from '@shared/models/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn = new BehaviorSubject<boolean>(false);

  constructor( private http: HttpClient) {

    this.checkToken();

  }

  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(authData: User): Observable<UserResponse | void> {

  return this.http.post<UserResponse>(
    `${environment.API_URL}/prod/api/v1/auth`,
    authData
    ).pipe(
      map( (res: UserResponse) => {
        this.saveToken(res.token);
        this.loggedIn.next(true);
        return res;
      }),
      catchError( (err) => this.handlerError(err))
    );

  }

  logout(): void {

    localStorage.removeItem('token');
    this.loggedIn.next(false);

  }

  private checkToken(): void {

    const userToken = localStorage.getItem('token');
    const isExpired = helper.isTokenExpired(userToken || undefined);
    isExpired ? this.logout() : this.loggedIn.next(true);

  }

  private saveToken(token: string): void {

    localStorage.setItem('token', token);

  }

  private handlerError(err: any): Observable<never> {

    let errorMessage: string = 'An error ocurred retrieving data';
    if (err) {
      errorMessage = `Error: code ${err.message}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);

  }

}
