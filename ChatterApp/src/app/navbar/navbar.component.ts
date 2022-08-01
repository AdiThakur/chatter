import { Component, OnInit } from '@angular/core';
import { SidenavService } from "../services/sidenav.service";

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	constructor(
		public sidenavService: SidenavService
	) {}

	ngOnInit(): void {
	}
}
