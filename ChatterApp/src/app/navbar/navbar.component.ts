import { Component, OnInit } from '@angular/core';
import { SidenavService } from "../services/sidenav.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { AbsolutePath } from "../routing/absolute-paths";
import { KeyPressHandler } from "../helpers/key-press-handler";

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	public query = "";
	public keyPressHandler: KeyPressHandler;

	constructor(
		private router: Router,
		public sidenavService: SidenavService,
		private authService: AuthService,
		public userService: UserService
	) {
		this.keyPressHandler = new KeyPressHandler([{
			key: "enter",
			handler: () => this.search()
		}])
	}

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
