import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatDrawerMode } from "@angular/material/sidenav";

@Injectable({
	providedIn: 'root'
})
export class SidenavService {

	private isScreenSmall = false;
	private isDismissible = false;
	private _isOpen = true;
	public get isOpen(): boolean {
		return this._isOpen;
	}

	private lastState = this._isOpen;

	public get mode(): MatDrawerMode {
		if (this.isScreenSmall) {
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
				}

				this.isScreenSmall = isSmall;

				if (this.isScreenSmall) {
					this._isOpen = false;
					this.isDismissible = true;
				} else {
					this._isOpen = this.lastState
					this.isDismissible = false;
				}
			})
	}

	public open(): void {
		this._isOpen = true;
	}

	public close(): void {
		if (this.isScreenSmall) {
			this._isOpen = false;
		}
	}

	public toggle(): void {
		this._isOpen = !this._isOpen;
		this.lastState = this._isOpen;
	}
}
