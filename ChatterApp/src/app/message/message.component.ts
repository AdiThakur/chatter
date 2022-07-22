import { Component, Input, OnInit } from '@angular/core';
import { MessageModel } from "../../types/message-model";
import { UserService } from "../services/user.service";

@Component({
	selector: 'message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

	@Input()
	public message: MessageModel;
	@Input()
	public firstInGroup: boolean;
	public isSender = false;

	constructor(
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.isSender = this.message.authorName == this.userService.user.username;
	}
}
