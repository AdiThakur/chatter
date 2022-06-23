import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from "../shared-services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	private readonly AUTHORIZATION_HEADER_KEY = 'Authorization';

	private getJwtFromLocalStorage(): string | null {
		return localStorage.getItem(AuthService.JWT_KEY);
	}

	private addAuthorizationHeader(request: HttpRequest<unknown>, jwt: string): void {
		if (!request.headers.has(this.AUTHORIZATION_HEADER_KEY)) {
			request.headers.append(this.AUTHORIZATION_HEADER_KEY, 'Bearer ' + jwt);
		}
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		let jwt = this.getJwtFromLocalStorage();
		if (jwt != null) {
			this.addAuthorizationHeader(request, jwt);
		}
		return next.handle(request);
	}
}
