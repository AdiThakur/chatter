import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { forkJoin, Observable, ReplaySubject } from "rxjs";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "./user.service";
import { MessageModel } from "../../types/message-model";
import { FiniteLoader } from "../helpers/loader";
import { defaultIfEmpty, switchMap, tap } from "rxjs/operators";
import { ToastService } from "../services/toast.service";
import { ChatService } from "./chat.service";
import { PageDetails } from "../helpers/Paginator";

@Injectable()
export class ChatRoomService {

	private selectedChatRoomSubject = new ReplaySubject<string>(1);
	public selectedChatRoom$ = this.selectedChatRoomSubject.asObservable();

	private _chatRooms = new Array<ChatRoomModel>();
	public get chatRooms(): ChatRoomModel[] {
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

	public loadChatRooms(): Observable<void> {
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
		.pipe(defaultIfEmpty(new Array<ChatRoomModel>()))
		.subscribe(() => {
			this.sortChatRooms();
			this.loader.finishLoad();
		});
	}

	private getChatRoom(chatRoomId: string): Observable<ChatRoomModel> {
		return this.httpService
			.get<ChatRoomModel>(
				`api/ChatRoom/${chatRoomId}`
			)
			.pipe(
				tap(chatRoom => {
					this._chatRooms.push(chatRoom);
				})
			);
	}

	private sortChatRooms(): void {
		this._chatRooms.sort((chatRoom1, chatRoom2) => {
			if (chatRoom1.latestMessage == null && chatRoom2.latestMessage != null) {
				return 1;
			} else if (
				chatRoom1.latestMessage != null && chatRoom2.latestMessage == null) {
				return -1;
			}

			return chatRoom1.id.localeCompare(chatRoom2.id);
		});
	}

	public selectChatRoom(chatRoomId: string): void {
		this.selectedChatRoomSubject.next(chatRoomId);
	}

	public getMemberCount(chatRoomId: string): number {
		let chatRoom = this._chatRooms.find(chatRoom => {
			return chatRoom.id === chatRoomId;
		});

		if (chatRoom) {
			return chatRoom.users.length;
		} else {
			return 0;
		}
	}

	public fetchMessages(chatRoomId: string, page: PageDetails): Observable<MessageModel[]> {
		return this.httpService
			.get<MessageModel[]>(
				`api/ChatRoom/${chatRoomId}/message?offset=${page.offset}&itemsPerPage=${page.itemsPerPage}`
			);
	}

	public fetchMatchingChatRooms(nameToMatch: string): Observable<ChatRoomModel[]> {
		return this.httpService
			.get<ChatRoomModel[]>(
				`api/ChatRoom?name=${nameToMatch}`
			);
	}

	public joinChatRoom(chatRoomId: string): Observable<ChatRoomModel> {
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
				}),
				tap(() => {
					this.sortChatRooms();
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
				this.toastService.createSuccessToast(`Left chatroom ${chatRoomId}`);
			});
	}

	private removeChatRoom(chatRoomId: string): void {
		let chatRoomIndex =
			this.chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
		if (chatRoomIndex >= 0) {
			this.chatRooms.splice(chatRoomIndex, 1);
		}
	}
}
