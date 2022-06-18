import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RegistrationModel } from "../../generated_types/registration-model";
import { Observable } from "rxjs";
import { UserModel } from "../../generated_types/user-model";

@Injectable({
	providedIn: 'root'
})
export class RegistrationService {

	constructor(private httpClient: HttpClient) {}

	public register(
		username: string, password: string, avatarId: string
	): Observable<UserModel>
	{
		return this.httpClient.post<UserModel>(
			'api/User',
			{ username, password, avatarId } as RegistrationModel
		);
	}
}
