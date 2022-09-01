import { Injectable } from '@angular/core';
import { MatDrawerMode } from "@angular/material/sidenav";
import { ViewPortService } from "./view-port.service";

@Injectable({
	providedIn: 'root'
})
export class SidenavService {

	private _isOpen = true;
	public get isOpen(): boolean {
		return this._isOpen;
	}

	private isScreenSmall = false;
	private lastState = this._isOpen;

	public get mode(): MatDrawerMode {
		if (this.isScreenSmall) {
			return 'over';
		} else {
			return 'side';
		}
	}

	constructor(
		private viewPortService: ViewPortService
	) {
		this.observeScreenSize();
	}

	private observeScreenSize(): void {
		this.viewPortService.isScreenSmall$.subscribe(isSmall => {
			this.isScreenSmall = isSmall;
			if (this.isScreenSmall) {
				this._isOpen = false;
			} else {
				this._isOpen = this.lastState;
			}
		});
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
