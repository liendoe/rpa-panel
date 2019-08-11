import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private tokenSubject: BehaviorSubject<string>;
    public currentUser: Observable<User>;
    public token: Observable<string>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        console.log('load currentUser from local storage '+ localStorage.getItem('currentUser'));
        console.log('load token from local storage '+ localStorage.getItem('token'));
        
        this.tokenSubject = new BehaviorSubject<string>(localStorage.getItem('token'));
        this.currentUser = this.currentUserSubject.asObservable();
        this.token = this.tokenSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentTokenValue(): string {
        return this.tokenSubject.value;
    }

    login(username: string, password: string) {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json'
            })
          };
        return this.http.post<any>(
            `${environment.apiUrl}/v1/users/login`, 
            { username, password },
            httpOptions
        ).pipe( map( response => {
                // login successful if there's a jwt token in the response
                if (response.success === true  && response.token) {
                    let user = response.user;
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(user);
                    this.tokenSubject.next(response.token);
                }

                return response;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.tokenSubject.next(null);
    }
}