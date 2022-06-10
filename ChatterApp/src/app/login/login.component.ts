import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	public username = "";
	public password = "";

	constructor(private httpClient: HttpClient) {}

	ngOnInit(): void {}

	public login(): void {
		this.httpClient.post<string>(
			"api/user/login",
			{ username: this.username, password: this.password }
		).subscribe({
			next: (response: string) => {
				console.log("Congratulations, you were able to login!", response)
			},
			error: (err) => {
				console.log("Ruh-ruh, something went wrong!", err)
			}
		})
	}
}
