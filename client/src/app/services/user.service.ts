import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = 'http://localhost:8000/api/users/';

  constructor(private http: HttpClient) { }

  getAuthorizedUser() {
    let user = localStorage.getItem('user');
    if (user !== undefined && user !== null) {
      return JSON.parse(user);
    }
    return null;
  }

  getUser() {
    let user = this.getAuthorizedUser();
    if (user !== null) {
    } else {
      this.logout();
    }

    return this.http.get(this.API_URL + 'get-user-by-username?username=' + user.username)
      .pipe(
        map((res: any) => {
          if (this._checkResponse(res)) {
            return {status: false, message: null}
          }
          return {status: true, message: res.data}
        }),
        catchError((error) => {
          // Ovde možeš da obradiš grešku
          if (error.status === 400) {
            return of(this._errorMessageConvert(error));
          } else if (error.status === 500) {
            return of({ status: false, message: 'Server Error. Please try again later.' });
          } else {
            return of({ status: false, message: 'An unexpected error occurred.' });
          }
        })
      );
  }

  updateUser(user: any) {
    return this.http.put(this.API_URL + 'uptede-user', user)
      .pipe(
        map((res: any) => {
          if (this._checkResponse(res)) {
            return {status: false, message: null}
          }
          return {status: true, message: res.data}
        }),
        catchError((error) => {
          // Ovde možeš da obradiš grešku
          if (error.status === 400) {
            return of(this._errorMessageConvert(error));
          } else if (error.status === 500) {
            return of({ status: false, message: 'Server Error. Please try again later.' });
          } else {
            return of({ status: false, message: 'An unexpected error occurred.' });
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    window.location.reload();
  }

  private _checkResponse(res: any) {
    if (res.message === undefined) return true;

    if (res.message !== 'SUCCESS') return true

    return false;
  }

  private _errorMessageConvert(code: any) {
    if (code.error.message !== undefined && code.error.message === 'INVALID_CREDENTIALS') {
      return {status: false, type: 'Any', messsage: 'Email or password is not correct. Try again.'}; 
      
    } else {
      return this._getFirstErrorKeyValue(code.error);
    }
  }

  private _getFirstErrorKeyValue(error: any): any {
    if (error && typeof error === 'object') {
      // Iteriramo kroz sve ključeve objekta
      for (const key in error) {
        if (Object.prototype.hasOwnProperty.call(error, key)) {
          const errorMessages = error[key];
  
          // Ako je vrednost niz i ako ima barem jedan element
          if (Array.isArray(errorMessages) && errorMessages.length > 0) {
            // Vraćamo ključ i prvi element
            return {status: false, type: key, message: `${key}: ${errorMessages[0]}`};
          }
        }
      }
    }
    return {status: false, type: 'Any', messsage: 'Unknown error occurred'};  // Ako nema greške
  }
}
