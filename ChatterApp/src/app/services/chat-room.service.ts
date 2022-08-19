import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { forkJoin, Observable, ReplaySubject } from "rxjs";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "./user.service";
import { MessageModel } from "../../types/message-model";
import { FiniteLoader } from "../helpers/loader";
import { switchMap, tap } from "rxjs/operators";
import { ToastService } from "../toast/toast.service";
import { ChatService } from "./chat.service";

type ChatRoomViewModel = ChatRoomModel & {
	latestMessage: null | MessageModel
};

@Injectable()
export class ChatRoomService {

	private selectedChatRoomSubject = new ReplaySubject<string>(1);
	public selectedChatRoom$ = this.selectedChatRoomSubject.asObservable();

	private _chatRooms = new Array<ChatRoomViewModel>();
	private chatRoomsMap = new Map<string, ChatRoomViewModel>();

	public get chatRooms(): ChatRoomViewModel[] {
		return this._chatRooms;
	}

	private loader: FiniteLoader;

	constructor(
		private httpService: HttpService,
		private toastService: ToastService,
		private userService: UserService,
		private chatService: ChatService
	) {
		this.loader = new FiniteLoader();
	}

	public load(): Observable<void> {
		this.loader.startLoad();
		this.getChatRooms();
		return this.loader.doneLoading$;
	}

	private getChatRooms(): void {
		forkJoin(
			this.userService
				.getChatRoomIds()
				.map(id => this.getChatRoom(id))
		)
		.subscribe(() => {
			this.sortChatRooms();
			this.loader.finishLoad();
		});
	}

	private getChatRoom(chatRoomId: string): Observable<MessageModel[]> {
		return this.httpService
			.get<ChatRoomModel>(
				`api/ChatRoom/${chatRoomId}`
			)
			.pipe(
				switchMap(chatRoom => {
					this._chatRooms.push(chatRoom as ChatRoomViewModel);
					this.chatRoomsMap.set(chatRoomId, chatRoom as ChatRoomViewModel);
					return this.fetchLatestMessage(chatRoomId);
				})
			);
	}

	private fetchLatestMessage(chatRoomId: string): Observable<MessageModel[]> {
		return this.httpService
			.get<MessageModel[]>(
				`api/ChatRoom/${chatRoomId}/message?count=1`
			)
			.pipe(
				tap(messages => {
					this.setLatestMessageForChatRoom(messages, chatRoomId);
				})
			);
	}

	private setLatestMessageForChatRoom(messages: MessageModel[], chatRoomId: string): void {
		let chatRoom = this.chatRoomsMap.get(chatRoomId);
		if (chatRoom) {
			if (messages.length == 1) {
				chatRoom.latestMessage = messages[0];
			} else {
				chatRoom.latestMessage = null;
			}
		}
	}

	private sortChatRooms(): void {
		this._chatRooms.sort((chatRoom1, chatRoom2) => {
			if (chatRoom1.latestMessage == null &&
				chatRoom2.latestMessage != null) {
				return 1;
			} else if (
				chatRoom1.latestMessage != null &&
				chatRoom2.latestMessage == null) {
				return -1;
			} else if (
				(chatRoom1.latestMessage == null && chatRoom2.latestMessage == null) ||
				(chatRoom1.latestMessage != null && chatRoom2.latestMessage != null)) {
				if (chatRoom1.id >= chatRoom2.id) {
					return 1;
				} else {
					return -1;
				}
			}
			return 0;
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

	public fetchMessages(chatRoomId: string, offset: number, count: number): Observable<MessageModel[]> {
		return this.httpService
			.get<MessageModel[]>(
				`api/ChatRoom/${chatRoomId}/message?offset=${offset}&count=${count}`
			);
	}

	public fetchMatchingChatRooms(nameToMatch: string): Observable<ChatRoomModel[]> {
		return this.httpService
			.get<ChatRoomModel[]>(
				`api/ChatRoom?name=${nameToMatch}`
			);
	}

	public joinChatRoom(chatRoomId: string): Observable<MessageModel[]> {
		return this.httpService
			.post<void>(
				`api/ChatRoom/${chatRoomId}/user`,
				this.userService.user
			)
			.pipe(
				switchMap(() => {
					this.chatService.joinChatRoom(chatRoomId);
					this.userService.joinChatRoom(chatRoomId);
					return this.getChatRoom(chatRoomId);
				})
			);
	}

	public leaveChatRoom(chatRoomId: string): void {
		this.httpService
			.delete<void>(
				`api/ChatRoom/${chatRoomId}/user/${this.userService.user.id}`
			)
			.subscribe(() => {
				this.chatService.leaveChatRoom(chatRoomId);
				this.userService.leaveChatRoom(chatRoomId);
				this.removeChatRoom(chatRoomId);
				this.toastService.createToast({
					title: "Success",
					description: `Left chatroom ${chatRoomId}`,
					type: "success",
					duration: 5000
				});
			});
	}

	private removeChatRoom(chatRoomId: string): void {
		let chatRoomIndex =
			this.chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
		if (chatRoomIndex >= 0) {
			this.chatRooms.splice(chatRoomIndex, 1);
			this.chatRoomsMap.delete(chatRoomId);
		}
	}
}
