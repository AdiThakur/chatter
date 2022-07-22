import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from "@angular/router";
import { AbsolutePath } from "./absolute-paths";

export class AppRouteReuseStrategy extends BaseRouteReuseStrategy {

	private readonly routesToRecreate = [
		AbsolutePath.ChatRoom
	]

	public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		let shouldRecreate = this.routesToRecreate.some(routeToRecreate => {
			return this.getResolvedUrl(future).includes(routeToRecreate);
		});

		if (shouldRecreate) {
			return false;
		} else {
			return super.shouldReuseRoute(future, curr);
		}
	}

	private getResolvedUrl(snapshot: ActivatedRouteSnapshot): string {
		return snapshot.pathFromRoot
			.map(s => s.url.map(segment => segment.toString()).join('/'))
			.join('/');
	}
}
