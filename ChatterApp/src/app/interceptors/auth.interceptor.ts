import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtStorageHelper } from "../helpers/jwt-storage-helper";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	private readonly AUTHORIZATION_HEADER_KEY = 'Authorization';

	private addAuthorizationHeader(request: HttpRequest<unknown>, jwt: string): void {
		if (!request.headers.has(this.AUTHORIZATION_HEADER_KEY)) {
			request.headers.append(this.AUTHORIZATION_HEADER_KEY, 'Bearer ' + jwt);
		}
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		let jwt = JwtStorageHelper.readEncodedJwt();
		if (jwt != null) {
			this.addAuthorizationHeader(request, jwt);
		}
		return next.handle(request);
	}
}
