import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { AuthService } from "./auth.service";
import { MessageModel } from "../../types/message-model";
import { Observable, Subject } from "rxjs";
import { HttpService } from "./http.service";

@Injectable()
export class ChatService {

	private readonly chatHubUrl = 'http://localhost:5001/chat';
	private connection: HubConnection;

	private messagesSubject = new Subject<MessageModel>();
	public messages$ = this.messagesSubject.asObservable();

	constructor(
		private httpService: HttpService,
		private authService: AuthService
	) {
		this.buildConnection();
		this.registerCallBacks();
		this.startConnection();
		this.authService.logout$.subscribe(() => this.stopConnection());
	}

	private buildConnection(): void {
		this.connection = new HubConnectionBuilder()
			.withUrl(
				this.chatHubUrl,
				{ accessTokenFactory: () => this.authService.getJwt() }
			)
			.build();
	}

	private registerCallBacks(): void {
		this.connection.on("ReceiveMessage", (message: MessageModel) => {
			this.messagesSubject.next(message);
		});
		this.connection.on("UserConnected", (chatRoomId: string) => {
		});
		this.connection.on("UserDisconnected", (chatRoomId: string) => {
		});
	}

	private startConnection(): void {
		if (this.connection.state != HubConnectionState.Connected) {
			this.connection.start();
		}
	}

	private stopConnection(): void {
		if (this.connection.state != HubConnectionState.Disconnected &&
			this.connection.state != HubConnectionState.Disconnecting) {
			this.connection.stop();
		}
	}

	public sendMessage(message: MessageModel): void {
		this.connection.invoke("SendMessage", message);
	}

	public joinChatRoom(chatRoomId: string): void {
		this.connection.invoke("JoinChatRoom", chatRoomId);
	}

	public leaveChatRoom(chatRoomId: string): void {
		this.connection.invoke("LeaveChatRoom", chatRoomId);
	}
}
