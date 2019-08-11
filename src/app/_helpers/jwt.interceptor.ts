import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        
        let currentUser = this.authenticationService.currentUserValue;
        let token = this.authenticationService.currentTokenValue;
        
        if (currentUser && token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `${token}`
                }
            });
        }
        let d = new Date();
        console.log(d.toISOString() + ' - '+request.url);
        console.log(request.headers);
        if(request.url =='http://localhost:3000/v1/users'){
            console.log(currentUser);
            console.log(token);
        }
        return next.handle(request);
    }
}