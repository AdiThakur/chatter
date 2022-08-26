import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatService } from "../services/chat.service";
import { MessageModel } from "../../types/message-model";
import { UserService } from "../services/user.service";
import { InfiniteLoader } from "../helpers/loader";
import { KeyPressHandler } from "../helpers/key-press-handler";
import { finalize } from "rxjs/operators";

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
	public keyHandler: KeyPressHandler;

	constructor(
		private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		private chatService: ChatService
	) {
		this.loader = new InfiniteLoader(1000);
		this.keyHandler = new KeyPressHandler([{
			key: "enter",
			handler: () => this.sendMessage()
		}]);
	}

	ngOnInit(): void {
		this.memberCount = this.chatRoomService.getMemberCount(this.chatRoomId);
		this.observeRouteParams();
		this.observeMessages();
		this.fetchMessages();
	}

	private observeRouteParams(): void {
		this.activatedRoute.params.subscribe(params => {
			this.chatRoomId = params['chatRoomId'];
			if (this.chatRoomId != null && this.chatRoomId != '') {
				this.chatRoomService.selectChatRoom(this.chatRoomId);
			}
		});
	}

	private observeMessages(): void {
		this.chatService.messages$.subscribe(message => {
			if (message.chatRoomId == this.chatRoomId) {
				this.renderLatestMessage(message);
				this.updatePreviousMessage();
			}
		});
	}

	private renderLatestMessage(message: MessageModel): void {
		let viewMessage = message as ViewMessage;
		viewMessage.showProfilePic = true;
		this.messages.unshift(viewMessage);
	}

	private updatePreviousMessage(): void {
		let previousMessage = this.messages[1];
		if (previousMessage &&
			previousMessage.authorName == this.messages[0].authorName) {
			previousMessage.showProfilePic = false;
		}
	}

	private fetchMessages(): void {
		this.loader.startLoad();
		this.chatRoomService
			.fetchMessages(this.chatRoomId, this.messageOffset, this.messageCount)
			.pipe(finalize(() => this.loader.finishLoad()))
			.subscribe(messages => {
				this.messageOffset += this.messageCount;
				this.renderMessages(messages);
			});
	}

	private renderMessages(messages: MessageModel[]): void {
		if (messages.length == 0) {
			return;
		}

		let viewMessages = messages.map(message => message as ViewMessage);
		let oldestRenderedMessageIndex = Math.max(this.messages.length, 0);
		this.messages.push(...viewMessages);

		viewMessages.forEach((viewMessage, index) => {
			viewMessage.showProfilePic =
				this.shouldShowProfilePic(oldestRenderedMessageIndex + index)
		});
	}

	private shouldShowProfilePic(currentMessageIndex: number): boolean {
		let indexOfPreviousMessageInList = currentMessageIndex - 1;
		if (indexOfPreviousMessageInList < 0) {
			return true;
		}

		let currentMessageAuthor = this.messages[currentMessageIndex].authorName;
		let prevMessageAuthor = this.messages[indexOfPreviousMessageInList].authorName;

		return prevMessageAuthor != currentMessageAuthor;
	}

	public sendMessage(): void {
		if (this.messageToSend == '') {
			return;
		}

		this.chatService.sendMessage({
			timeStamp: new Date(),
			chatRoomId: this.chatRoomId,
			authorName: this.userService.user.username,
			authorAvatarUri: this.userService.user.avatarUri,
			content: this.messageToSend
		});

		this.messageToSend = '';
	}

	public scrollThresholdReached(): void {
		this.fetchMessages();
	}
}
