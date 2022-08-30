import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from "./auth.interceptor";
import { ApiErrorInterceptor } from "./api-error.interceptor";

export const httpInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },
];
