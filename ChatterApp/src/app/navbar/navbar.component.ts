import { Component, OnInit } from '@angular/core';
import { SidenavService } from "../services/sidenav.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { ChatRoomService } from "../services/chat-room.service";
import { Router } from "@angular/router";
import { AbsolutePath } from "../routing/absolute-paths";

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	public query = "";

	constructor(
		private router: Router,
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

		this.router.navigate(
			[AbsolutePath.Results],
			{ queryParams: { query: this.query } }
		);
	}

	public logout(): void {
		this.authService.logout();
	}
}
