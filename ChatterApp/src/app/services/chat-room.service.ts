import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable, Subject } from "rxjs";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "./user.service";
import { MessageModel } from "../../types/message-model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class ChatRoomService {

	private selectedChatRoom = new Subject<ChatRoomModel>();
	public selectedChatRoom$ = this.selectedChatRoom.asObservable();

	constructor(
		private router: Router,
		private httpService: HttpService,
		private userService: UserService
	) {}

	public selectChatRoom(chatRoom: ChatRoomModel): void {
		this.router.navigate([`/chatroom`, chatRoom.id]);
		this.selectedChatRoom.next(chatRoom);
	}

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
