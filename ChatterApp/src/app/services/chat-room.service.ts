import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable, ReplaySubject } from "rxjs";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "./user.service";
import { MessageModel } from "../../types/message-model";
import { map } from "rxjs/operators";

@Injectable()
export class ChatRoomService {

	private selectedChatRoomSubject = new ReplaySubject<string>(1);
	public selectedChatRoom$ = this.selectedChatRoomSubject.asObservable();

	private chatRoomsSubject = new ReplaySubject<ChatRoomModel[]>(1);
	public chatRooms$ = this.chatRoomsSubject.asObservable();

	constructor(
		private httpService: HttpService,
		private userService: UserService
	) {}

	public selectChatRoom(chatRoomId: string): void {
		this.selectedChatRoomSubject.next(chatRoomId);
	}

	public getChatRooms(): Observable<ChatRoomModel[]> {
		this.httpService
			.get<ChatRoomModel[]>(
				`api/User/${this.userService.user.id}/chatrooms`
			)
			.subscribe(chatRooms => {
				this.chatRoomsSubject.next(chatRooms);
			});

		return this.chatRooms$;
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
