import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	usernameFormControl!: FormControl;
	passwordFormControl!: FormControl;
	confirmPasswordFormControl!: FormControl;

	constructor() {}

	ngOnInit(): void {
		this.usernameFormControl =
			new FormControl("", [Validators.required, Validators.email]);
		this.passwordFormControl =
			new FormControl("", Validators.required);
		this.confirmPasswordFormControl =
			new FormControl("", Validators.required);
		this.confirmPasswordFormControl.valueChanges.subscribe((value: string) => {
			if (value != this.passwordFormControl.value) {
				this.confirmPasswordFormControl.setErrors({ misMatch: true });
			}
		});
	}
}
