import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from "@angular/common/http";
import { ToastService } from "../toast/toast.service";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { TypeAssertions}  from "../helpers/type-assertions";

@Injectable({
	providedIn: 'root'
})
export class HttpService {

	constructor(
		private httpClient: HttpClient,
		private toastService: ToastService
	) {}

	private handleError<T>(
		error: HttpErrorResponse, source: Observable<unknown>
	): Observable<T> {

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

	public post<T>(url: string, body: unknown): Observable<T> {
		return this.httpClient
			.post<T>(url, body)
			.pipe(
				catchError((error, _) => {
					return this.handleError<T>(error, _);
				})
			);
	}

	public get<T>(url: string): Observable<T> {
		return this.httpClient
			.get<T>(url)
			.pipe(
				catchError((error, _) => {
					return this.handleError<T>(error, _);
				})
			);
	}

	public delete<T>(url: string): Observable<T> {
		return this.httpClient
			.delete<T>(url)
			.pipe(
				catchError((error, _) => {
					return this.handleError<T>(error, _);
				})
			);
	}
}
