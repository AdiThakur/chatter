import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthenticationModel } from "../../types/authentication-model";
import { Jwt } from "../../types/jwt";
import { LocalStorageService, SessionStorageService } from "./storage.service";

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private jwt: null | Jwt = null;

	constructor(
		private localStorageService: LocalStorageService,
		private sessionStorageService: SessionStorageService,
		private httpService: HttpService
	) {
		this.loadJwt();
	}

	public get userId(): null | number {
		return this.jwt?.getClaim("id") as null | number;
	}

	public get hasUserSeenLogin(): boolean {
		let isLoggedIn = this.sessionStorageService.read<boolean>("isLoggedIn");
		if (isLoggedIn == null) {
			return false;
		}

		return isLoggedIn;
	}

	public set hasUserSeenLogin(hasSeenLogin: boolean) {
		this.sessionStorageService.write("isLoggedIn", hasSeenLogin);
	}

	public isJwtValid(): boolean {
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
					this.loadJwt();
				})
			);
	}

	private storeJwt(jwt: string): void {
		this.localStorageService.write("jwt", jwt);
	}

	private loadJwt(): void {
		let encodedJwt = this.localStorageService.read<string>("jwt");
		if (encodedJwt != null) {
			this.jwt = new Jwt(encodedJwt);
		}
	}
}
