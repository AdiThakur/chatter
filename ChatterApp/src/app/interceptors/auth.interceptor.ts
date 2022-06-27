import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from "../services/storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	private readonly AUTHORIZATION_HEADER_KEY = 'Authorization';

	constructor(private localStorageService: LocalStorageService) {}

	private addAuthorizationHeader(request: HttpRequest<unknown>, jwt: string): HttpRequest<unknown> {
		return request.clone({
			headers: request.headers.set(
				this.AUTHORIZATION_HEADER_KEY,
				`Bearer ${jwt}`
			)
		});
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

		let jwt = this.localStorageService.read<string>("jwt");

		if (jwt == null) {
			return next.handle(request);
		} else {
			let requestWithHeaders = this.addAuthorizationHeader(request, jwt);
			return next.handle(requestWithHeaders);
		}
	}
}
