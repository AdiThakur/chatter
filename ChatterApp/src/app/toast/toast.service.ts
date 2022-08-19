import { Injectable }  from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { ToastComponent } from "./toast.component";

@Injectable({
	providedIn: 'root'
})
export class ToastService {

	constructor(private snackbar: MatSnackBar) {}

	public createSuccessToast(description: string): void {
		this.createToast({
			title: "Success",
			description: description,
			duration: 5000,
			type: "success"
		});
	}

	public createErrorToast(description: string): void {
		this.createToast({
			title: "Error",
			description: description,
			duration: 5000,
			type: "error"
		});
	}

	public createToast(options: ToastOptions): void {

		let snackbarConfig = new MatSnackBarConfig<ToastData>();
		snackbarConfig.verticalPosition = "top";
		snackbarConfig.horizontalPosition = "right";
		snackbarConfig.panelClass = options.type;
		snackbarConfig.data = {
			title: options.title,
			description: options.description
		};

		if (options.duration) {
			snackbarConfig.duration = options.duration;
		}

		this.snackbar.openFromComponent(
			ToastComponent,
			snackbarConfig
		);
	}
}

type ToastType = 'success' | 'informational' | 'error';

export interface ToastData {
	title: string,
	description?: string
}

interface ToastOptions {
	title: string
	description?: string,
	type: ToastType,
	duration?: number
}
