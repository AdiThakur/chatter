import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { ToastData } from "./toast.service";

@Component({
	selector: 'toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.css']
})
export class ToastComponent {

	private readonly MAX_TITLE_LENGTH = 25;
	private readonly MAX_DESCRIPTION_LENGTH = 100;

	public title: string;
	public truncatedTitle: string;
	public description?: string;
	public truncatedDescription?: string;

	constructor(
		@Inject(MAT_SNACK_BAR_DATA) private data: ToastData
	) {
		this.title = data.title;
		this.truncatedTitle = this.title.substring(0, this.MAX_TITLE_LENGTH);
		this.description = data.description;
		this.truncatedDescription = this.description?.substring(0, this.MAX_DESCRIPTION_LENGTH);
	}
}
