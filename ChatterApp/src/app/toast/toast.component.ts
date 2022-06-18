import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";
import { ToastData } from "./toast.service";

@Component({
	selector: 'toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.css']
})
export class ToastComponent {

	public title: string;
	public description?: string;

	constructor(
		private matSnackbarRef: MatSnackBarRef<ToastComponent>,
		@Inject(MAT_SNACK_BAR_DATA) private data: ToastData
	) {
		this.title = data.title;
		this.description = data.description;
	}
}
