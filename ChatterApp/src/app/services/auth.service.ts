import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthenticationModel } from "../../types/authentication-model";
import { Jwt } from "../../types/jwt";
import { JwtStorageHelper } from "../helpers/jwt-storage-helper";

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	public hasUserSeenLogin = false;

	private jwt: null | Jwt = null;

	constructor(
		private httpService: HttpService
	) {
		this.loadJwt();
	}

	public get userId(): null | number {
		return this.jwt?.getClaim("id") as null | number;
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
