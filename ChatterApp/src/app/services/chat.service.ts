import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { AuthService } from "./auth.service";

@Injectable()
export class ChatService {

	private readonly chatHubUrl = 'http://localhost:5001/chat';
	private connection: HubConnection;

	constructor(private authService: AuthService) {
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
		// Temporary hub method; subject to change
		this.connection.on("SendMessage", (message) => {
			alert(message)
		});
	}

	private startConnection(): void {
		if (this.connection.state != HubConnectionState.Connected) {
			this.connection.start();
		}
	}
}
