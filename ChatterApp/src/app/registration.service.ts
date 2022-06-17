import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class RegistrationService {

	constructor(private httpClient: HttpClient) {}

	public register(username: string, password: string, avatar: string)
	{
		let userModel = { username, password };
		this.httpClient
			.post('api/User', userModel)
			.subscribe(
				(createdUser) => {
					alert("User successfully created! " + JSON.stringify(createdUser));
				},
				(error) => {

				}
			);
	}
}
