import { Component, OnInit } from '@angular/core';
import { SidenavService } from "../services/sidenav.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	constructor(
		public sidenavService: SidenavService,
		private authService: AuthService,
		public userService: UserService
	) {}

	ngOnInit(): void {
	}

	public logout(): void {
		this.authService.logout();
	}
}
