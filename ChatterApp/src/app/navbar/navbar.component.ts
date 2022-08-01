import { Component, OnInit } from '@angular/core';
import { SidenavService } from "../services/sidenav.service";
import { UserService } from "../services/user.service";

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	constructor(
		public sidenavService: SidenavService,
		public userService: UserService
	) {}

	ngOnInit(): void {
	}
}
