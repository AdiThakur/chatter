import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class HttpService {

	constructor(
		private httpClient: HttpClient
	) {}

	public post<T>(url: string, body: unknown): Observable<T> {
		return this.httpClient.post<T>(url, body);
	}

	public get<T>(url: string): Observable<T> {
		return this.httpClient.get<T>(url);
	}

	public delete<T>(url: string): Observable<T> {
		return this.httpClient.delete<T>(url);
	}
}
