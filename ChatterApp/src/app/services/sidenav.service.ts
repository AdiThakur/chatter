import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatDrawerMode } from "@angular/material/sidenav";

@Injectable({
	providedIn: 'root'
})
export class SidenavService {

	private _isScreenSmall = false;

	private _isOpen = true;
	public get isOpen(): boolean {
		return this._isOpen;
	}

	public get canBeToggled(): boolean {
		return this._isScreenSmall;
	}

	public get mode(): MatDrawerMode {
		if (this._isScreenSmall) {
			return 'over';
		} else {
			return 'side';
		}
	}

	constructor(
		private breakpointObserver: BreakpointObserver
	) {
		this.observeBreakPoints();
	}

	private observeBreakPoints(): void {
		this.breakpointObserver
			.observe([
				Breakpoints.XSmall,
				Breakpoints.Small
			])
			.subscribe(state => {
				let isSmall =
					state.breakpoints[Breakpoints.XSmall] ||
					state.breakpoints[Breakpoints.Small];
				if (isSmall == undefined) {
					return;
				} else {
					this._isScreenSmall = isSmall;
					this._isOpen = !this._isScreenSmall;
				}
			});
	}

	public open(): void {
		if (this.canBeToggled) {
			this._isOpen = true;
		}
	}

	public close(): void {
		if (this.canBeToggled) {
			this._isOpen = false;
		}
	}

	public toggle(): void {
		if (this.canBeToggled) {
			this._isOpen = !this._isOpen;
		}
	}
}
