import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { UserModel } from "../../types/user-model";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class UserService {

	public user!: UserModel;

	constructor(
		private httpService: HttpService
	) {}

	public loadUser(userId: number): Observable<UserModel> {
		return this.httpService
			.get<UserModel>(`api/User/${userId}`)
			.pipe(
				tap((userModel) => {
						this.user = userModel;
				})
			);
	}
}
