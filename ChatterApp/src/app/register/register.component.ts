import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastService } from "../toast/toast.service";
import { UserModel } from "../../types/user-model";
import { RegistrationModel } from "../../types/registration-model";
import { HttpService } from "../services/http.service";

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	username = "";
	password = "";
	isPasswordShown = false;

	isAvatarSelected = false;
	selectedAvatar: string = "";
	// TODO: Make dynamic
	avatars = [
		"avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png", "avatar5.png",
		"avatar6.png", "avatar7.png", "avatar8.png", "avatar9.png",
	];

	accountDetailsFormGroup!: UntypedFormGroup;
	usernameFormControl!: UntypedFormControl;
	passwordFormControl!: UntypedFormControl;
	confirmPasswordFormControl!: UntypedFormControl;
	chatRoomFormControl!: UntypedFormControl;

	constructor(
		private httpService: HttpService,
		private toastService: ToastService
	) {}

	ngOnInit(): void {
		this.setupForms();
	}

	private setupForms()
	{
		this.setupUsernameForm();
		this.setupPasswordForm();
		this.setupConfirmPasswordForm();

		this.accountDetailsFormGroup = new UntypedFormGroup({
			username: this.usernameFormControl,
			password: this.passwordFormControl,
			confirmPassword: this.confirmPasswordFormControl
		});

		this.chatRoomFormControl = new UntypedFormControl('');
	}

	private setupUsernameForm()	{
		this.usernameFormControl =
			new UntypedFormControl('', [
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(20)
				]
			);
		this.usernameFormControl.valueChanges.subscribe(
			value => this.username = value
		);
	}

	private setupPasswordForm() {
		this.passwordFormControl =
			new UntypedFormControl('', [
					Validators.required,
					Validators.minLength(15),
					Validators.maxLength(30)
				]
			);
		this.passwordFormControl.valueChanges.subscribe(
			value => this.password = value
		);
	}

	private setupConfirmPasswordForm() {
		this.confirmPasswordFormControl =
			new UntypedFormControl('', Validators.required);
		this.confirmPasswordFormControl.valueChanges.subscribe(
			(value: string) => {
				if (value != this.passwordFormControl.value) {
					this.confirmPasswordFormControl.setErrors(
						{ misMatch: true }
					);
				}
			}
		);
	}

	public selectAvatar(avatarId: string): void {
		this.selectedAvatar = avatarId;
		this.isAvatarSelected = true;
	}

	public register(): void {

		let registrationModel: RegistrationModel = {
			username: this.username,
			password: this.password,
			avatarId: this.selectedAvatar
		};

		this.httpService.post<UserModel>(
			'api/User', registrationModel
		).subscribe(
			(userModel) => {
				this.toastService.createToast({
					title: "User created successfully",
					type: "success",
					duration: 5000
				});
			}
		);
	}
}
