import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ToastService } from "../toast/toast.service";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatService } from "../services/chat.service";
import { HubConnectionBuilder } from "@microsoft/signalr";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [
		ChatRoomService,
		ChatService
	]
})
export class HomeComponent implements OnInit {

	public isLoading = true;

	constructor(
		private router: Router,
		private toastService: ToastService,
		private authService: AuthService,
		private userService: UserService,
		private chatService: ChatService
	) {}

	ngOnInit(): void {
		let userId = this.authService.userId;
		// TODO: Move the user-loading process to a Guard
		this.userService
			.loadUser(userId)
			.subscribe(
				() => this.isLoading = false,
				() => this.handleInvalidSession()
			);
	}

	private handleInvalidSession(): void {
		this.router.navigate(['/login'])
			.then(() => {
				this.toastService.createToast({
					title: "Session Expired",
					description: "Please sign in again",
					type: "error",
					duration: 2000
				});
			});
	}
}
