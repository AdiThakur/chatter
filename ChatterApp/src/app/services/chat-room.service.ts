import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "./user.service";

@Injectable()
export class ChatRoomService {

	constructor(
		private httpService: HttpService,
		private userService: UserService
	) {}

	public getChatRooms(): Observable<ChatRoomModel[]> {
		return this.httpService
			.get<ChatRoomModel[]>(
				`api/User/${this.userService.user.id}/chatrooms`
			);
	}
}
