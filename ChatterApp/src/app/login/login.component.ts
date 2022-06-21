import { Component, OnInit } from '@angular/core';
import { HttpService } from "../helpers/http.service";
import { AuthenticationModel } from "../../../generated_types/authentication-model";
import { ToastService } from "../toast/toast.service";

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
		private httpService: HttpService,
		private toastService: ToastService
	) {}

	ngOnInit(): void {}

	public login(): void {
		this.httpService.post<AuthenticationModel>(
			"api/user/login",
			{ username: this.username, password: this.password }
		).subscribe(
			authModel => {
				this.toastService.createToast({
					title: "Login Successful",
					description: authModel.jwt,
					type: "success",
					duration: 5000
				});
			}
		)
	}
}
