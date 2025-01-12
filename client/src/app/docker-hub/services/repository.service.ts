import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  private API_URL = 'http://localhost:8000/api/dashboard/';

  constructor(private http: HttpClient) { }

  searchByText(query: string) {
    return this.http.get(this.API_URL + 'search?query=' + query)
      .pipe(
          map((res: any) => {
            if (!this._checkResponse(res)) {
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

  getRepositoryByName(query: any) {
    return this.http.get(this.API_URL + 'search-repositories?username=' + query.username + '&query=' + query.repositoryName)
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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

  getOneRepositoryByName(repository: any, username: any) {
    return this.http.get(this.API_URL + 'get-one-repository-by-name?username=' + username + '&repository-name=' + repository)
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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

  getTagsByRepository(id: any) {
    return this.http.get(this.API_URL + 'get-tags-by-repository?repositoryId=' + id)
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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
  
  getAllRepositoryByUsernam(username: string) {
    return this.http.get(this.API_URL + 'get-all-repository?username=' + username)
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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

  createNewRepository(newRepository: any) {
    return this.http.post(this.API_URL + 'repositories/create/', newRepository)
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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
      )
  }

  updateRepository(reposioty: any, user: any) {
    return this.http.put(this.API_URL + 'repositories/update/', {reposioty: reposioty, user: user})
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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
      ) 
  }

  removeTags(listTags: any) {
    return this.http.post(this.API_URL + 'repositories/tags/delete/', {listTags: listTags})
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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
      ) 
  }

  addNewTag(repositoryId: any, tags: any, username: any) {
    return this.http.post(this.API_URL + 'repositories/tags/add/', 
      { 
        newTag: {
          repository: repositoryId,
          tag: tags.version,
          name: tags.name,
          description: tags.description
        },
        username: username
      })
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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
      ) 
  }

  addCollaborator(object: any) {
    return this.http.put(this.API_URL + 'repositories/collaborators/', object)
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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
      ) 
  }

  updateSettings(repository: any) {
    return this.http.put(this.API_URL + 'repositories/update/settings/', repository)
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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
      ) 
  }

  removeReposiroty(reposirotyId: any) {
    return this.http.delete(this.API_URL + 'repositories/delete?reposirotyId=' + reposirotyId)
      .pipe(
        map((res: any) => {
          if (!this._checkResponse(res)) {
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
      ) 
  }

  private _checkResponse(res: any) {
    if (res.message === undefined) return true;

    if (res.message === 'SUCCESS') return true

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
