import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatService } from "../services/chat.service";
import { MessageModel } from "../../types/message-model";
import { UserService } from "../services/user.service";

type ViewMessage = MessageModel & { showProfilePic: boolean };

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

	public chatRoomId: string;
	public currentMessage: string = "";
	public messages: ViewMessage[] = [];

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
			if (message.chatRoomId == this.chatRoomId) {
				let viewMessage = message as ViewMessage;
				this.messages.unshift(viewMessage);
				viewMessage.showProfilePic = this.shouldShowProfilePic(this.messages, 0);
			}
		});

		this.chatService.getLastTenMessages(this.chatRoomId).subscribe(lastTenMessages => {
			let viewMessages: ViewMessage[] = [];

			lastTenMessages.forEach((message, index) => {
				let viewMessage = message as ViewMessage;
				viewMessage.showProfilePic = this.shouldShowProfilePic(lastTenMessages, index);
				viewMessages.push(viewMessage);
			});

			this.messages = [...viewMessages, ...this.messages];
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

		this.currentMessage = '';
	}

	private shouldShowProfilePic(messages: MessageModel[], index: number): boolean {
		let nextIndex = index + 1;

		if (nextIndex >= messages.length) {
			return true;
		} else {
			return messages[index].authorName != messages[index + 1].authorName;
		}
	}
}
