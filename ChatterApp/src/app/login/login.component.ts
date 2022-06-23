import { Component, OnInit } from '@angular/core';
import { ToastService } from "../toast/toast.service";
import { AuthService } from "../shared-services/auth.service";

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
		private authService: AuthService,
		private toastService: ToastService
	) {}

	ngOnInit(): void {}

	public login(): void {
		this.authService
			.login(this.username, this.password)
			.subscribe(authModel => {
				this.toastService.createToast({
					title: "Login successful!",
					type: "success",
					duration: 5000
				});
			});
	}
}
