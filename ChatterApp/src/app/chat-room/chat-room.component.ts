import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatService } from "../services/chat.service";
import { MessageModel } from "../../types/message-model";
import { UserService } from "../services/user.service";
import { InfiniteLoader } from "../helpers/loader";

type ViewMessage = MessageModel & { showProfilePic: boolean };

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

	public chatRoomId: string;
	public memberCount = 0;

	public messageToSend: string = "";
	public messages: ViewMessage[] = [];
	private messageOffset = 0;
	private readonly messageCount = 10;

	public loader: InfiniteLoader;

	constructor(
		private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		private chatService: ChatService
	) {
		this.loader = new InfiniteLoader();
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.chatRoomId = params['chatRoomId'];
			if (this.chatRoomId != null && this.chatRoomId != '') {
				this.chatRoomService.selectChatRoom(this.chatRoomId);
			}
		});

		this.memberCount = this.chatRoomService.getMemberCountForChatRoom(this.chatRoomId);
		this.fetchMessages();

		this.chatService.messages$.subscribe(message => {
			if (message.chatRoomId == this.chatRoomId) {
				let viewMessage = message as ViewMessage;
				this.messages.unshift(viewMessage);
				viewMessage.showProfilePic = this.shouldShowProfilePic(this.messages, 0);
			}
		});
	}

	private fetchMessages(): void {
		this.loader.startLoad();
		this.chatRoomService
			.fetchMessages(this.chatRoomId, this.messageOffset, this.messageCount)
			.subscribe(messages => {
				this.messageOffset += this.messageCount;
				this.setMessages(messages);
				this.loader.finishLoad();
			});
	}

	private setMessages(messages: MessageModel[]): void {
		let viewMessages = messages.map((message, index) => {
			let viewMessage = message as ViewMessage;
			viewMessage.showProfilePic = this.shouldShowProfilePic(messages, index);
			return viewMessage;
		});

		this.messages.push(...viewMessages);
	}

	public sendMessage(): void {
		if (this.messageToSend == '') {
			return;
		}

		let messageModel = {
			timeStamp: new Date(),
			chatRoomId: this.chatRoomId,
			authorName: this.userService.user.username,
			authorAvatarUri: this.userService.user.avatarUri,
			content: this.messageToSend
		} as MessageModel;

		this.chatService.sendMessage(messageModel);

		this.messageToSend = '';
	}

	private shouldShowProfilePic(messages: MessageModel[], index: number): boolean {
		let nextIndex = index + 1;

		if (nextIndex >= messages.length) {
			return true;
		} else {
			return messages[index].authorName != messages[index + 1].authorName;
		}
	}

	public scrollThresholdReached(): void {
		this.fetchMessages();
	}
}
