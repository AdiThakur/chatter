import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { UserModel } from "../../types/user-model";
import { tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { RegistrationModel } from "../../types/registration-model";

@Injectable({
	providedIn: 'root'
})
export class UserService {

	public user!: UserModel;

	constructor(
		private httpService: HttpService
	) {}

	public loadUser(userId: null | number): Observable<UserModel> {
		if (userId == null) {
			return throwError(new Error());
		}

		return this.httpService
			.get<UserModel>(`api/User/${userId}`)
			.pipe(
				tap((userModel) => {
						this.user = userModel;
				})
			);
	}

	public getChatRoomIds(): string[] {
		return this.user.chatRooms;
	}

	public isUserInChatRoom(chatRoomId: string): boolean {
		return this.user.chatRooms.some(id => id === chatRoomId);
	}

	public joinChatRoom(chatRoomId: string): void {
		this.user.chatRooms.push(chatRoomId);
	}

	public leaveChatRoom(chatRoomId: string): void {
		let index = this.user.chatRooms.findIndex(id => id === chatRoomId);
		if (index >= 0) {
			this.user.chatRooms.splice(index, 1);
		}
	}

	public registerUser(registeringUser: RegistrationModel): Observable<UserModel> {
		return this.httpService.post<UserModel>('api/User', registeringUser);
	}
}
