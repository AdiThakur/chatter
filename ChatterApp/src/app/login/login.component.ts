import { Component, OnInit } from '@angular/core';
import { ToastService } from "../toast/toast.service";
import { AuthService } from "../shared-services/auth.service";
import { Router } from "@angular/router";

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	username = "";
	password = "";
	isPasswordShown = false;

	constructor(
		private router: Router,
		private authService: AuthService
	) {}

	ngOnInit(): void {}

	public login(): void {
		this.authService
			.login(this.username, this.password)
			.subscribe(() => {
				this.router.navigate(['/home']);
			});
	}
}
