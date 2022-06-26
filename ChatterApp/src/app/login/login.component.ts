import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { ToastService } from "../toast/toast.service";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { StateExtras } from "../guards/auth.guard";

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	username = "";
	password = "";
	isPasswordShown = false;

	private readonly redirectUrl: undefined | string;

	constructor(
		private router: Router,
		private toastService: ToastService,
		private authService: AuthService,
		private userService: UserService
	) {
		let routeState = this.router.getCurrentNavigation()?.extras?.state as StateExtras;
		this.redirectUrl = routeState?.requestedRoute;
	}

	ngOnInit(): void {
		if (this.authService.isJwtValid()) {
			this.loadUser();
		}
	}

	public login(): void {
		this.authService
			.login(this.username, this.password)
			.subscribe(() => {
				this.loadUser();
			});
	}

	private loadUser(): void {

		let userId = this.authService.userId
		if (userId == null) {
			this.showSessionExpiredError();
			return;
		}

		this.userService
			.loadUser(userId)
			.subscribe(
				() => {
					this.authService.hasUserSeenLogin = true;
					// TODO: Hide loading spinner
					this.continueNavigation();
				},
				(error: HttpErrorResponse) => {
					if (error.status == HttpStatusCode.Unauthorized) {
						this.showSessionExpiredError();
					}
				}
			);
	}

	private showSessionExpiredError(): void {
		this.toastService.createToast({
			title: "Session Expired",
			type: "error",
			duration: 2000
		});
	}

	private continueNavigation(): void {
		console.log(this.redirectUrl)
		if (this.redirectUrl == undefined) {
			this.router.navigate(["/"]);
		} else {
			this.router.navigateByUrl(this.redirectUrl);
		}
	}
}
