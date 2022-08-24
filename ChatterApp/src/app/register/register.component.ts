import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "../toast/toast.service";
import { HttpService } from "../services/http.service";
import { InfiniteLoader } from "../helpers/loader";
import { finalize } from "rxjs/operators";
import { Router } from "@angular/router";
import { AbsolutePath } from "../routing/absolute-paths";
import { UserService } from "../services/user.service";

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	public loader: InfiniteLoader;

	public username = "";
	public password = "";
	public isPasswordShown = false;

	public isAvatarSelected = false;
	public selectedAvatar: string = "";
	// TODO: Make dynamic
	public avatars = [
		"avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png", "avatar5.png",
		"avatar6.png", "avatar7.png", "avatar8.png", "avatar9.png",
	];

	public accountDetailsFormGroup: FormGroup;
	public usernameFormControl: FormControl;
	public passwordFormControl: FormControl;
	public confirmPasswordFormControl: FormControl;

	constructor(
		private router: Router,
		private httpService: HttpService,
		private toastService: ToastService,
		private userService: UserService
	) {
		this.loader = new InfiniteLoader();
	}

	ngOnInit(): void {
		this.setupUsernameForm();
		this.setupPasswordForm();
		this.setupConfirmPasswordForm();
		this.setupFormGroup();
	}

	private setupUsernameForm(): void {
		let validators = [
			Validators.required,
			Validators.minLength(5),
			Validators.maxLength(20)
		];
		this.usernameFormControl = new FormControl('', validators);
		this.usernameFormControl
			.valueChanges
			.subscribe(
				value => this.username = value
			);
	}

	private setupPasswordForm(): void {
		let validators = [
			Validators.required,
			Validators.minLength(15),
			Validators.maxLength(30)
		];
		this.passwordFormControl = new FormControl('', validators);
		this.passwordFormControl
			.valueChanges
			.subscribe(
				value => this.password = value
			);
	}

	private setupConfirmPasswordForm(): void {
		this.confirmPasswordFormControl =
			new FormControl('', Validators.required);
		this.confirmPasswordFormControl
			.valueChanges
			.subscribe((value) => {
				if (value != this.passwordFormControl.value) {
					this.confirmPasswordFormControl.setErrors(
						{ misMatch: true }
					);
				}
			});
	}

	private setupFormGroup(): void {
		this.accountDetailsFormGroup = new FormGroup({
			username: this.usernameFormControl,
			password: this.passwordFormControl,
			confirmPassword: this.confirmPasswordFormControl
		});
	}

	public selectAvatar(avatarId: string): void {
		this.selectedAvatar = avatarId;
		this.isAvatarSelected = true;
	}

	public register(): void {
		this.loader.startLoad();
		this.userService
			.registerUser({
				username: this.username,
				password: this.password,
				avatarId: this.selectedAvatar
			})
			.pipe(finalize(() => this.loader.finishLoad()))
			.subscribe(() => {
				this.router
					.navigate([AbsolutePath.Login])
					.then(() => {
						this.toastService.createSuccessToast("User created successfully");
					});
			});
	}
}
