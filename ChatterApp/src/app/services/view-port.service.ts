import { Injectable } from '@angular/core';
import { ReplaySubject } from "rxjs";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Injectable({
	providedIn: 'root'
})
export class ViewPortService {

	private isScreenSmallSubject = new ReplaySubject<boolean>(1);
	public isScreenSmall$ = this.isScreenSmallSubject.asObservable();

	private _height: number;
	public get height(): number {
		return this._height;
	}

	private _width: number;
	public get width(): number {
		return this._width;
	}

	constructor(
		private breakpointObserver: BreakpointObserver
	) {
		this.setInitialViewPortDimensions();
		this.observeBreakPoints();
	}

	private setInitialViewPortDimensions(): void {
		this._height = window.innerHeight;
		this._width = window.innerWidth;
	}

	private observeBreakPoints(): void {
		this.breakpointObserver
			.observe([
				Breakpoints.XSmall,
				Breakpoints.Small
			])
			.subscribe(state => {
				let isScreenSmall =
					state.breakpoints[Breakpoints.XSmall] ||
					state.breakpoints[Breakpoints.Small];

				if (isScreenSmall == undefined ||
					!isScreenSmall) {
					this.isScreenSmallSubject.next(false);
				} else {
					this.isScreenSmallSubject.next(true);
				}
			});
	}
}
