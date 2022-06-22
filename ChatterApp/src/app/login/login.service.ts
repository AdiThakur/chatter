import { Injectable } from '@angular/core';
import { HttpService } from "../helpers/http.service";
import { Observable } from "rxjs";
import { AuthenticationModel } from "../../../generated_types/authentication-model";
import { tap } from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	public static JWT_KEY = "jwt";

	private _isUserLoggedIn = false;

	constructor(private httpService: HttpService) {}

	private isUserLoggedIn(): boolean {
		return this._isUserLoggedIn;
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

	private storeJwt(jwt: string): void {
		localStorage.setItem(LoginService.JWT_KEY, jwt);
	}
}
