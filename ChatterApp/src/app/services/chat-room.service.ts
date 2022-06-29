import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "./user.service";
import { MessageModel } from "../../types/message-model";
import { map } from "rxjs/operators";

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

	public getLatestMessageForChatRoom(chatRoomId: string): Observable<null | MessageModel> {
		return this.httpService
			.get<MessageModel[]>(
				`api/ChatRoom/${chatRoomId}/messages?count=1`
			)
			.pipe(
				map(messages => {
					if (messages.length == 1) {
						return messages[0];
					} else {
						return null;
					}
				})
			);
	}
}
