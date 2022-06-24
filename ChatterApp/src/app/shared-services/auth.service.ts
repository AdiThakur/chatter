import { Injectable } from '@angular/core';
import { HttpService } from "../helpers/http.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthenticationModel } from "../../types/authentication-model";
import { Jwt } from "../../types/jwt";
import { JwtStorageHelper } from "../helpers/jwt-storage-helper";

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	public userId: null | number;

	private jwt: null | Jwt;

	constructor(
		private httpService: HttpService
	) {
		this.loadJwt();
		this.userId  = this.jwt?.getClaim("id") as null | number;
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
					JwtStorageHelper.writeEncodedJwt(authModel.jwt);
					this.loadJwt();
				})
			);
	}

	private loadJwt(): void {
		let encodedJwt = JwtStorageHelper.readEncodedJwt();
		if (encodedJwt != null) {
			this.jwt = new Jwt(encodedJwt);
		}
	}
}
