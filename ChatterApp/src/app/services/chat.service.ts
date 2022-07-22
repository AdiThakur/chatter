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

	private messages = new Subject<MessageModel>();
	public messages$ = this.messages.asObservable();

	constructor(
		private httpService: HttpService,
		private authService: AuthService
	) {
		this.buildConnection();
		this.registerCallBacks();
		this.startConnection();
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
			this.messages.next(message);
		});
	}

	private startConnection(): void {
		if (this.connection.state != HubConnectionState.Connected) {
			this.connection.start();
		}
	}

	public sendMessage(message: MessageModel): void {
		this.connection.invoke("SendMessage", message);
	}

	public getLastTenMessages(chatRoomId: string): Observable<MessageModel[]> {
		return this.httpService
			.get<MessageModel[]>(
				`api/ChatRoom/${chatRoomId}/messages?count=10`
			);
	}
}
