import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable, ReplaySubject } from "rxjs";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "./user.service";
import { MessageModel } from "../../types/message-model";
import { Loader } from "../helpers/loader";

type ChatRoomViewModel = ChatRoomModel & {
	latestMessage: null | MessageModel
};

@Injectable()
export class ChatRoomService {

	private selectedChatRoomSubject = new ReplaySubject<string>(1);
	public selectedChatRoom$ = this.selectedChatRoomSubject.asObservable();

	private _chatRooms = new Array<ChatRoomModel>();
	private chatRoomsMap = new Map<string, ChatRoomViewModel>();

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
		this.userService
			.getChatRoomIds()
			.forEach(id => {
				this.getChatRoom(id);
			});
	}

	private getChatRoom(chatRoomId: string): void {
		this.httpService
			.get<ChatRoomModel>(
				`api/ChatRoom/${chatRoomId}`
			)
			.subscribe(chatRoom => {
				this._chatRooms.push(chatRoom);
				this.chatRoomsMap.set(chatRoomId, chatRoom as ChatRoomViewModel);
				this.fetchLatestMessage(chatRoomId);
			});
	}

	private fetchLatestMessage(chatRoomId: string): void {
		this.loader.startLoad();

		this.httpService
			.get<MessageModel[]>(
				`api/ChatRoom/${chatRoomId}/messages?count=1`
			)
			.subscribe(messages => {
				this.loader.finishLoad();
				let chatRoom = this.chatRoomsMap.get(chatRoomId);
				if (chatRoom) {
					if (messages.length == 1) {
						chatRoom.latestMessage = messages[0];
					} else {
						chatRoom.latestMessage = null;
					}
				}
			});
	}

	public selectChatRoom(chatRoomId: string): void {
		this.selectedChatRoomSubject.next(chatRoomId);
	}

	public getMemberCountForChatRoom(chatRoomId: string): number {
		let chatRoom = this.chatRoomsMap.get(chatRoomId);
		if (chatRoom) {
			return chatRoom.users.length;
		} else {
			return 0;
		}
	}

	public getLatestMessage(chatRoomId: string): null | MessageModel {
		let chatRoom = this.chatRoomsMap.get(chatRoomId);
		if (chatRoom) {
			return chatRoom.latestMessage;
		} else {
			return null;
		}
	}

	public fetchLastTenMessages(chatRoomId: string): Observable<MessageModel[]> {
		return this.httpService
			.get<MessageModel[]>(
				`api/ChatRoom/${chatRoomId}/messages?count=10`
			);
	}

	public fetchMatchingChatRooms(nameToMatch: string): Observable<ChatRoomModel[]> {
		return this.httpService
			.get<ChatRoomModel[]>(
				`api/ChatRoom?name=${nameToMatch}`
			);
	}
}
