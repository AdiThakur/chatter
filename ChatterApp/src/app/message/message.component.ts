import { Component, Input, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { MessageViewModel } from "../../types/message-view-model";

@Component({
	selector: 'message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

	@Input()
	public message: MessageViewModel;

	public isSender = false;
	public styles : { [key: string]: string } = {};
	public shortenedTimeStamp: string;

	constructor(
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.isSender = this.message.authorName == this.userService.user.username;
		this.setTimeStamp();
		this.setBackgroundColor();
		this.setBorderRadii('1.5rem');
	}

	private setTimeStamp(): void {
		let timeStamp = new Date(this.message.timeStamp as any);
		this.shortenedTimeStamp = timeStamp.toLocaleString();
	}

	private setBackgroundColor(): void {
		let backgroundColor = this.isSender ? 'lightblue' : 'lightgreen';
		this.addStyle('background-color', backgroundColor);
	}

	private setBorderRadii(valueAndUnit: string): void {
		let profilePictureSide = this.isSender ? 'right' : 'left';
		let oppositeSide = this.isSender ? 'left' : 'right';

		this.addStyle(`border-top-${oppositeSide}-radius`, valueAndUnit);
		this.addStyle(`border-bottom-${oppositeSide}-radius`, valueAndUnit);
		this.addConditionalStyle(`border-top-${profilePictureSide}-radius`, valueAndUnit, this.message.isEarliest);
		this.addConditionalStyle(`border-bottom-${profilePictureSide}-radius`, valueAndUnit, this.message.isLatest);
	}

	private addStyle(styleKey: string, value: string): void {
		this.addConditionalStyle(styleKey, value, true);
	}

	private addConditionalStyle(
		styleKey: string, value: string, condition: boolean
	): void {
		if (condition) {
			this.styles[styleKey] = value;
		}
	}
}
