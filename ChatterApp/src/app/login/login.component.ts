import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { ToastService } from "../services/toast.service";
import { NavigationStateExtras } from "../guards/auth.guard";
import { AbsolutePath } from "../routing/absolute-paths";
import { InfiniteLoader } from "../helpers/loader";
import { finalize } from "rxjs/operators";

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	public username = "";
	public password = "";
	public isPasswordShown = false;
	public loader: InfiniteLoader;
	private readonly redirectUrl: undefined | string;

	constructor(
		private router: Router,
		private toastService: ToastService,
		private authService: AuthService
	) {
		this.loader = new InfiniteLoader();
		let routeState = this.router.getCurrentNavigation()?.extras?.state as NavigationStateExtras;
		this.redirectUrl = routeState?.requestedRoute;
	}

	ngOnInit(): void {
		if (this.authService.isJwtValid()) {
			this.continueNavigation();
		}
	}

	public login(): void {
		this.loader.startLoad();
		this.authService
			.login(this.username, this.password)
			.pipe(finalize(() => this.loader.finishLoad()))
			.subscribe(() => {
				this.continueNavigation();
			});
	}

	private continueNavigation(): void {
		if (this.redirectUrl == undefined) {
			this.router.navigate([AbsolutePath.Home]);
		} else {
			this.router.navigateByUrl(this.redirectUrl);
		}
	}
}
