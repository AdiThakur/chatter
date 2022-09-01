import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ViewPortService {

	private readonly _height;
	public get height(): number {
		return this._height;
	}

	private readonly _width;
	public get width(): number {
		return this._width;
	}

	constructor() {
		this._height = window.innerHeight;
		this._width = window.innerWidth;
	}
}
