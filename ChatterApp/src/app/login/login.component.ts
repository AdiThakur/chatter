import { Component, OnInit } from '@angular/core';
import { ToastService } from "../toast/toast.service";
import { LoginService } from "./login.service";

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
		private loginService: LoginService,
		private toastService: ToastService
	) {}

	ngOnInit(): void {}

	public login(): void {
		this.loginService
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
