import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RegistrationService } from "../registration.service";

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	username = "";
	password = "";

	isAvatarSelected = false;
	selectedAvatar: string = "";
	// TODO: Make dynamic
	avatars = [
		"avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png", "avatar5.png",
		"avatar6.png", "avatar7.png", "avatar8.png", "avatar9.png",
	];

	accountDetailsFormGroup!: FormGroup;
	usernameFormControl!: FormControl;
	passwordFormControl!: FormControl;
	confirmPasswordFormControl!: FormControl;
	chatRoomFormControl!: FormControl;

	constructor(private registrationService: RegistrationService) {}

	ngOnInit(): void {

		this.usernameFormControl =
			new FormControl('', [
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(20)
			]
		);
		this.usernameFormControl.valueChanges.subscribe(
			value => this.username = value
		);

		this.passwordFormControl =
			new FormControl('', [
				Validators.required,
				Validators.minLength(15),
				Validators.maxLength(30)
			]
		);
		this.passwordFormControl.valueChanges.subscribe(
			value => this.password = value
		);

		this.confirmPasswordFormControl =
			new FormControl('', Validators.required);
		this.confirmPasswordFormControl.valueChanges.subscribe((value: string) => {
			if (value != this.passwordFormControl.value) {
				this.confirmPasswordFormControl.setErrors({ misMatch: true });
			}
		});

		this.accountDetailsFormGroup = new FormGroup({
			username: this.usernameFormControl,
			password: this.passwordFormControl,
			confirmPassword: this.confirmPasswordFormControl
		});

		this.chatRoomFormControl = new FormControl('');
	}

	public selectAvatar(avatarId: string): void {
		this.selectedAvatar = avatarId;
		this.isAvatarSelected = true;
	}

	public register(): void {
		this.registrationService.register(
			this.username, this.password, this.selectedAvatar
		);
	}
}
