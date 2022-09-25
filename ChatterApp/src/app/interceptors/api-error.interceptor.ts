import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastService } from "../services/toast.service";
import { catchError } from "rxjs/operators";
import { TypeAssertions } from "../helpers/type-assertions";

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {

	constructor(
		private toastService: ToastService
	) {}

	private handleApiError(error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
		let errorDetails = error.error;

		if (TypeAssertions.isErrorDetails(errorDetails)) {
			this.toastService.createToast({
				title: errorDetails.title,
				description: errorDetails.description,
				type: "error",
				duration: 5000
			});
		}

		return throwError(error);
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next
			.handle(request)
			.pipe(
				catchError(error => this.handleApiError(error))
			);
	}
}
