import { Injectable } from '@angular/core';
import { HttpService } from "../helpers/http.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthenticationModel } from "../../types/authentication-model";
import { Jwt } from "../../types/jwt";

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	public static JWT_KEY = "jwt";

	private _isUserLoggedIn = false;
	private jwt: null | Jwt;

	constructor(
		private httpService: HttpService
	) {
		let encodedJwt = this.loadJwt();
		if (encodedJwt != null) {
			this.jwt = new Jwt(encodedJwt);
		}
	}

	public isUserLoggedIn(): boolean {
		if (this.jwt == null) {
			return false;
		}

		return this.jwt.isValid();
	}

	public login(username: string, password: string): Observable<AuthenticationModel> {
		return this.httpService
			.post<AuthenticationModel>(
				"api/user/login",
				{ username, password }
			).pipe(
				tap(authModel => {
					this.storeJwt(authModel.jwt);
					this._isUserLoggedIn = true;
				})
			);
	}

	private loadJwt(): null | string {
		return localStorage.getItem(AuthService.JWT_KEY);
	}

	private storeJwt(jwt: string): void {
		localStorage.setItem(AuthService.JWT_KEY, jwt);
	}
}
