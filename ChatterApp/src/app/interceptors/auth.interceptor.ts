import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor, HttpErrorResponse, HttpStatusCode
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from "../services/storage.service";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { ToastService } from "../services/toast.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	private readonly AUTHORIZATION_HEADER_KEY = 'Authorization';

	constructor(
		private localStorageService: LocalStorageService,
		private toastService: ToastService,
		private authService: AuthService
	) {}

	private addAuthorizationHeader(
		jwt: string | null, request: HttpRequest<unknown>
	): HttpRequest<unknown> {
		if (jwt == null) {
			return request;
		}

		return request.clone({
			headers: request.headers.set(
				this.AUTHORIZATION_HEADER_KEY,
				`Bearer ${jwt}`
			)
		});
	}

	private handleUnauthorizedError(error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
		if (error.status == HttpStatusCode.Unauthorized) {
			this.authService.logout();
			this.toastService.createToast({
				title: "Session Expired",
				description: "Please login again",
				type: "error",
				duration: 5000
			});
		}

		return throwError(error);
	}

	intercept(request: HttpRequest<unknown>, nextHttpHandler: HttpHandler): Observable<HttpEvent<unknown>> {
		let jwt = this.localStorageService.read<string>("jwt");
		return nextHttpHandler
			.handle(this.addAuthorizationHeader(jwt, request))
			.pipe(
				catchError(error => this.handleUnauthorizedError(error))
			);
	}
}
