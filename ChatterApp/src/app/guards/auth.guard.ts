import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { AbsolutePath } from "../routing/absolute-paths";

export type NavigationStateExtras = undefined | {
	requestedRoute: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(
		private router: Router,
		private authService: AuthService
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.authService.hasUserSeenLogin) {
			return true;
		} else {
			this.router.navigate([AbsolutePath.Login], { state: { requestedRoute: state.url }});
			return false;
		}
	}
}
