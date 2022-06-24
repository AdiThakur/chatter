import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { HttpService } from "./http.service";
import { UserModel } from "../../types/user-model";

@Injectable()
export class UserService {

	public user!: UserModel;

	constructor(
		private httpService: HttpService,
		private authService: AuthService
	) {
		let userId = this.authService.userId;
		if (userId != null) {
			this.loadUser(userId);
		}
	}

	private loadUser(userId: number): void {
		this.httpService
			.get<UserModel>(`api/User/${userId}`)
			.subscribe((userModel) => {
				this.user = userModel;
			});
	}
}
