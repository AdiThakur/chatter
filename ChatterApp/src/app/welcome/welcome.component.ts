import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

	public username: string;

	constructor(
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.username = this.userService.user.username;
	}
}
