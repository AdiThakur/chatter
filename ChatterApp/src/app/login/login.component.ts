import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { ToastService } from "../toast/toast.service";
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
		private authService: AuthService
	) {
		let routeState = this.router.getCurrentNavigation()?.extras?.state as StateExtras;
		this.redirectUrl = routeState?.requestedRoute;
	}

	ngOnInit(): void {
		if (this.authService.isJwtValid()) {
			this.continueNavigation();
		}
	}

	public login(): void {
		this.authService
			.login(this.username, this.password)
			.subscribe(() => {
				this.continueNavigation();
			});
	}

	private continueNavigation(): void {
		if (this.redirectUrl == undefined) {
			this.router.navigate(["/"]);
		} else {
			this.router.navigateByUrl(this.redirectUrl);
		}
	}
}
