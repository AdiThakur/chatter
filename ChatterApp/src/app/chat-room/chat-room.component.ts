import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatService } from "../services/chat.service";
import { MessageModel } from "../../types/message-model";
import { UserService } from "../services/user.service";

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ChatRoomComponent implements OnInit {

	public chatRoomId: null | string = null;
	public currentMessage: string = "";

	constructor(
		private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		private chatService: ChatService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.chatRoomId = params['chatRoomId'];
			if (this.chatRoomId != null && this.chatRoomId != '') {
				this.chatRoomService.selectChatRoom(this.chatRoomId);
			}
		});

		this.chatService.messages$.subscribe(message => {
			// TODO: Change so that is adds a UI element to display this message
			console.log("Received message:", message);
		});
	}

	public sendMessage(): void {
		if (this.currentMessage == '') {
			return;
		}

		let messageModel = {
			timeStamp: new Date(),
			chatRoomId: this.chatRoomId,
			authorName: this.userService.user.username,
			authorAvatarUri: this.userService.user.avatarUri,
			content: this.currentMessage
		} as MessageModel;

		this.chatService.sendMessage(messageModel);
	}
}
