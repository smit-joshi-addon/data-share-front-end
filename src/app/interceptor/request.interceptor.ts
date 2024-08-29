import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { take } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  token: string;

  constructor(private authService: NbAuthService) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Clone the request to add the new header.
    let authReq = request;



    if (this.authService.isAuthenticated()) {
      // Get the auth token (assuming it's stored in the auth service or you have access to it)
      this.authService.getToken().subscribe((t) => this.token = t.getValue()); // Adjust this according to your auth service

      // Add the Authorization header to the cloned request
      authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      });
    }
    return next.handle(authReq);
  }
}
