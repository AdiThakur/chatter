import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable, ReplaySubject } from "rxjs";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "./user.service";
import { MessageModel } from "../../types/message-model";
import { Loader } from "../helpers/loader";

type ViewChatRoom = ChatRoomModel & {
	latestMessage: null | MessageModel
};

@Injectable()
export class ChatRoomService {

	private selectedChatRoomSubject = new ReplaySubject<string>(1);
	public selectedChatRoom$ = this.selectedChatRoomSubject.asObservable();

	private chatRoomsMap: { [key: string]: ViewChatRoom } = {};

	private _chatRooms: ChatRoomModel[];
	public get chatRooms(): ChatRoomModel[] {
		return this._chatRooms;
	}

	private loader: Loader;

	constructor(
		private httpService: HttpService,
		private userService: UserService
	) {
		this.loader = new Loader();
	}

	public load(): Observable<void> {
		this.getChatRooms();
		return this.loader.doneLoading$;
	}

	private getChatRooms(): void {
		this.httpService
			.get<ChatRoomModel[]>(
				`api/User/${this.userService.user.id}/chatrooms`
			)
			.subscribe(chatRooms => {
				this._chatRooms = chatRooms;
				this.initChatRoomsMap();
				this.getLatestMessages();
			});
	}

	private initChatRoomsMap(): void {
		this._chatRooms.forEach(chatRoom => {
			this.chatRoomsMap[chatRoom.id] = chatRoom as ViewChatRoom;
		});
	}

	private getLatestMessages(): void {
		this.loader.startLoad(this._chatRooms.length);
		this._chatRooms.forEach(chatRoom => {
			this.getLatestMessage(chatRoom.id);
		});
	}

	private getLatestMessage(chatRoomId: string): void {
		this.httpService
			.get<MessageModel[]>(
				`api/ChatRoom/${chatRoomId}/messages?count=1`
			)
			.subscribe(messages => {
				this.loader.finishLoad();
				if (messages.length == 1) {
					this.chatRoomsMap[chatRoomId].latestMessage = messages[0];
				} else {
					this.chatRoomsMap[chatRoomId].latestMessage = null;
				}
			});
	}

	public selectChatRoom(chatRoomId: string): void {
		this.selectedChatRoomSubject.next(chatRoomId);
	}

	public getMemberCountForChatRoom(chatRoomId: string): number {
		let chatRoom = this.chatRoomsMap[chatRoomId];
		if (chatRoom) {
			return chatRoom.users.length;
		} else {
			return 0;
		}
	}

	public getLatestMessageForChatRoom(chatRoomId: string): null | MessageModel {
		let chatRoom = this.chatRoomsMap[chatRoomId];
		if (chatRoom) {
			return chatRoom.latestMessage;
		} else {
			return null;
		}
	}
}
