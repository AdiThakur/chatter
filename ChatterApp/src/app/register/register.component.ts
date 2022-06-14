import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

interface Chatroom {
	id: string,
	description: string
}

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	accountDetailsFormGroup!: FormGroup;
	usernameFormControl!: FormControl;
	passwordFormControl!: FormControl;
	confirmPasswordFormControl!: FormControl;

	isAvatarSelected = false;
	selectedAvatar: string = "";
	// TODO: Make dynamic
	avatars = [
		"avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png", "avatar5.png",
		"avatar6.png", "avatar7.png", "avatar8.png", "avatar9.png",
	];

	chatRoomFormControl!: FormControl;
	selectedChatrooms: Chatroom[] = [
		{ id: 'CSC301', description: 'Software Engineering' },
		{ id: 'BIO120', description: 'Intro to Biology' },
		{ id: 'CSC265', description: 'Literal Hell' },
		{ id: 'MAT135', description: 'Calculus A' }
	];

	constructor() {}

	ngOnInit(): void {

		this.usernameFormControl =
			new FormControl('', [Validators.required, Validators.email]);
		this.passwordFormControl =
			new FormControl('', Validators.required);
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

	selectAvatar(avatarId: string): void {
		this.selectedAvatar = avatarId;
		this.isAvatarSelected = true;
	}
}
