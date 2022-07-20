import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { ToastService } from "../toast/toast.service";
import { StateExtras } from "../guards/auth.guard";
import { AbsolutePath } from "../routing/absolute-paths";

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
		private authService: AuthService
	) {
		let routeState = this.router.getCurrentNavigation()?.extras?.state as StateExtras;
		this.redirectUrl = routeState?.requestedRoute;
	}

	ngOnInit(): void {
		if (this.authService.isJwtValid()) {
			this.allowNavigation();
		}
	}

	public login(): void {
		this.authService
			.login(this.username, this.password)
			.subscribe(() => {
				this.allowNavigation();
			});
	}

	private allowNavigation(): void {
		this.authService.hasUserSeenLogin = true;

		if (this.redirectUrl == undefined) {
			this.router.navigate([AbsolutePath.Home]);
		} else {
			this.router.navigateByUrl(this.redirectUrl);
		}
	}
}
