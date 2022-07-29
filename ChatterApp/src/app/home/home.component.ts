import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ToastService } from "../toast/toast.service";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatService } from "../services/chat.service";
import { AbsolutePath } from "../routing/absolute-paths";
import { SidenavService } from "../services/sidenav.service";

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

	public hasLoaded = false;

	constructor(
		private router: Router,
		private toastService: ToastService,
		public sidenavService: SidenavService,
		private authService: AuthService,
		private userService: UserService,
		private chatRoomService: ChatRoomService
	) {}

	ngOnInit(): void {
		this.loadUserService();
	}

	private loadUserService(): void {
		let userId = this.authService.userId;
		this.userService
			.loadUser(userId)
			.subscribe(
				() => this.loadChatRoomService(),
				() => this.handleInvalidSession()
			);
	}

	private loadChatRoomService(): void {
		this.chatRoomService
			.load()
			.subscribe(
				() => this.hasLoaded = true
			);
	}

	private handleInvalidSession(): void {
		this.router
			.navigate([AbsolutePath.Login])
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
