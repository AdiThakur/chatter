import { Component, OnInit } from '@angular/core';
import { SidenavService } from "../services/sidenav.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { ChatRoomService } from "../services/chat-room.service";

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	public query = "";

	constructor(
		public sidenavService: SidenavService,
		private authService: AuthService,
		public userService: UserService,
		private chatRoomService: ChatRoomService
	) {}

	ngOnInit(): void {}

	public search(): void {
		if (this.query == "") {
			return;
		}

		this.chatRoomService
			.fetchMatchingChatRooms(this.query)
			.subscribe(chatRoomModels => console.log(chatRoomModels));
	}

	public logout(): void {
		this.authService.logout();
	}
}
