import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ToastService } from "../toast/toast.service";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public isLoading = true;

	constructor(
		private router: Router,
		private toastService: ToastService,
		private authService: AuthService,
		private userService: UserService
	) {}

	ngOnInit(): void {
		let userId = this.authService.userId;
		this.userService
			.loadUser(userId)
			.subscribe(
				() => this.loadChatRooms(),
				() => this.handleInvalidSession()
			);
	}

	private loadChatRooms(): void {
	}

	private handleInvalidSession(): void {
		this.router.navigate(['/'])
			.then(() => {
				this.toastService.createToast({
					title: "Session Expired",
					type: "error",
					duration: 2000
				});
			});
	}
}
