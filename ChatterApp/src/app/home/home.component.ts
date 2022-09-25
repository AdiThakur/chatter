import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ToastService } from "../services/toast.service";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatService } from "../services/chat.service";
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
				() => this.loadChatRoomService()
			);
	}

	private loadChatRoomService(): void {
		this.chatRoomService
			.loadChatRooms()
			.subscribe(
				() => this.hasLoaded = true
			);
	}
}
